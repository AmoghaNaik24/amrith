-- Run this whole file in Supabase > SQL Editor.
create table profiles(id uuid primary key references auth.users on delete cascade,
  display_name text not null, role text not null check(role in('admin','member')),
  timezone text not null check(timezone in('Asia/Kolkata','America/Phoenix')));
create table chapters(id serial primary key, chapter_number int unique not null, chapter_date date not null,
  title text not null, message text not null, song_title text, song_artist text, song_url text);
create table questions(id serial primary key, chapter_id int not null references chapters on delete cascade,
  question_text text not null, sort_order int default 0);
create table responses(id serial primary key, question_id int not null references questions on delete cascade,
  user_id uuid not null references profiles on delete cascade, content text not null,
  created_at timestamptz default now(), updated_at timestamptz default now(), unique(question_id,user_id));
create index on questions(chapter_id); create index on responses(question_id);

-- Server-side clock: chapter unlocks 08:00 local on its date; Dec 4 unlocks 17:00 local; then everything is open.
create function is_member() returns boolean language sql stable security definer set search_path=public as
$$ select exists(select 1 from profiles where id=auth.uid()) $$;
create function is_admin() returns boolean language sql stable security definer set search_path=public as
$$ select exists(select 1 from profiles where id=auth.uid() and role='admin') $$;
create function chapter_unlocked(d date) returns boolean language sql stable security definer set search_path=public as
$$ select coalesce(is_admin() or (select
     now() >= case when d >= date '2026-12-04' then (d + time '17:00') at time zone p.timezone
                   else (d + time '08:00') at time zone p.timezone end
     or now() >= (timestamp '2026-12-04 17:00') at time zone p.timezone
   from profiles p where p.id=auth.uid()), false) $$;

alter table profiles enable row level security; alter table chapters enable row level security;
alter table questions enable row level security; alter table responses enable row level security;
create policy "members see profiles" on profiles for select using (is_member());
create policy "chapters unlocked" on chapters for select using (is_member() and chapter_unlocked(chapter_date));
create policy "admin edits chapters" on chapters for all using (is_admin()) with check (is_admin());
create policy "questions unlocked" on questions for select using (is_member() and exists(select 1 from chapters c where c.id=chapter_id and chapter_unlocked(c.chapter_date)));
create policy "admin edits questions" on questions for all using (is_admin()) with check (is_admin());
create policy "read responses" on responses for select using (is_member() and exists(select 1 from questions q join chapters c on c.id=q.chapter_id where q.id=question_id and chapter_unlocked(c.chapter_date)));
create policy "write own response" on responses for insert with check (user_id=auth.uid() and is_member() and exists(select 1 from questions q join chapters c on c.id=q.chapter_id where q.id=question_id and chapter_unlocked(c.chapter_date)));
create policy "edit own response" on responses for update using (user_id=auth.uid()) with check (user_id=auth.uid());
alter publication supabase_realtime add table responses;

insert into chapters(chapter_number,chapter_date,title,song_title,song_artist,message) values
(1,'2026-11-27','A Little Warmth','Until I Found You','Stephen Sanchez',$$Some nights don't need long conversations or big promises.

Sometimes, all I want is to remind you that you are loved.

I hope you sleep peacefully tonight, knowing that somewhere, someone is smiling because you exist.

Goodnight, my favourite person. ❤️$$),
(2,'2026-11-28','Growing Together','Shinunoga E-Wa','Fujii Kaze',$$Questions I once carried:

"Will you really promise me that you will always treat me the same way till the end?"
"Will you forgive me if I did something that you hate?"
"Will you be the version that I built in my brain?"
"I want to sit alone in a peaceful environment, like we are lost in each other."
"Grow with you, who brings the best in me and I bring the best in you."
"You are 26, I'm 20. Your needs are different from mine. Would it affect?"

I didn't want a perfect person. I wanted someone with whom I could grow without having to lose myself.$$),
(3,'2026-11-29','Feeling Like Home','Love Story','Taylor Swift',$$"What if you take me for granted and leave me in grief?"
"You think like my mom, care like my brother and protect like my dad. I'll feel home with you."
"Would you disrespect me for anything?"

Maybe feeling at home isn't about a place. Maybe it's about being able to be yourself around someone without being afraid.$$),
(4,'2026-11-30','The Little Things','Like My Father','Jax',$$"I'll die for you if you bring me flowers and open the door for me to sit."
"I'm searching to give something as a mark of my presence, but everything I brought is not on my own."
"So I can only give you a hug which you can carry until you see me again."
"Will you meet me again before you leave India?"

Sometimes the smallest gestures mean more than the most expensive gifts. I never wanted grand things. I wanted thoughtful things.$$),
(5,'2026-12-01','Across the Distance','Hey There Delilah','Plain White T''s',$$"It's easy to love yourself than loving someone, and I see you as a person with same mindset."
"Would you fulfill all my dreams?"
"You shouldn't feel stressed in loving someone in any aspect, either career, future or anything."
"And I'm exactly feeling zero percent stress about you. I think I'm sure about you."
"Is it a prank or did you take any dare that you'll make me fall?"
"If not, I don't actually understand why you like me when there are hundred reasons to not love me."
"Is there anything that you are hiding with me? A bad thing?"

I don't want either of us to feel that love is an obstacle to our ambitions. I want us to become better people while supporting each other.$$),
(6,'2026-12-02','The Anticipation','Blinding Lights','The Weeknd',$$"I feel like you are perfect. Is there anything that you are hiding with me? A bad thing?"
"Always feel you are better than me, smarter than me, taller than me, hotter than me."
"So I wouldn't care giving my hand to you."

I have had so many questions in my mind. Some were serious, some were silly, and some were probably just my overthinking.

But here we are.

I can't wait to see you.$$),
(7,'2026-12-03','The Night Before','Perfect','Ed Sheeran',$$Tomorrow is no longer just a date on the calendar.

It is a moment we have talked about, imagined, and waited for.

I don't know whether I'll be nervous, excited, silent, or smiling continuously.

But I know that tomorrow will become a memory.$$),
(8,'2026-12-04','Finally, The Day','Perfect','Ed Sheeran',$$THE COUNTDOWN IS OVER.
DECEMBER 04, 2026
WE FINALLY MADE IT HERE.

To the person who answered questions I once carried...

(Ammu: edit this letter in Supabase > Table editor > chapters.)

A giver always deserves another giver, and I will be your giver forever.

Will you hold my hand forever?$$);

insert into questions(chapter_id,question_text,sort_order)
select c.id,q.t,q.o from chapters c join (values
(1,'What is one little thing that made you smile today?',1),
(2,'What does growing together mean to you?',1),(2,'What is something you hope we learn about each other?',2),(2,'What do you think makes two people compatible despite their differences?',3),
(3,'What makes you feel at home with someone?',1),(3,'What is one thing you want me to understand about you?',2),(3,'What does respect mean to you in a relationship?',3),
(4,'What is one small gesture that makes you feel loved?',1),(4,'What is a memory you want us to create?',2),(4,'What would you want to remember about our first meeting?',3),
(5,'What is one dream you want to achieve?',1),(5,'How can we support each other''s careers?',2),(5,'What is something you want to be completely honest about?',3),
(6,'ARE YOU READY TO MEET ME?',1),
(7,'How do you feel before we meet?',1),
(8,'In your own words, what would you like to say?',1)) q(n,t,o) on q.n=c.chapter_number;
