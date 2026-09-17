-- Preserve existing category IDs where possible while standardizing the three
-- article topics used by the CMS and public navigation.
do $$
declare
  topic record;
  id_by_slug uuid;
  id_by_name uuid;
begin
  for topic in
    select * from (values
      ('Development'::text, 'development'::text),
      ('Projects'::text, 'projects'::text),
      ('Personal'::text, 'personal'::text)
    ) as topics(name, slug)
  loop
    select id into id_by_slug
      from public.categories
      where slug = topic.slug;

    select id into id_by_name
      from public.categories
      where lower(name) = lower(topic.name);

    if id_by_slug is not null and id_by_name is not null and id_by_slug <> id_by_name then
      raise exception 'Cannot safely standardize topic %: name and slug belong to different categories.', topic.name;
    elsif id_by_slug is not null then
      update public.categories set name = topic.name where id = id_by_slug;
    elsif id_by_name is not null then
      update public.categories set name = topic.name, slug = topic.slug where id = id_by_name;
    else
      insert into public.categories (name, slug) values (topic.name, topic.slug);
    end if;
  end loop;
end;
$$;
