
-- Check if group_id foreign key exists and add it if missing
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'group_members_group_id_fkey' 
        AND table_name = 'group_members'
    ) THEN
        ALTER TABLE public.group_members 
        ADD CONSTRAINT group_members_group_id_fkey 
        FOREIGN KEY (group_id) REFERENCES public.groups(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Check if contributions user_id foreign key exists and add it if missing
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'contributions_user_id_fkey' 
        AND table_name = 'contributions'
    ) THEN
        ALTER TABLE public.contributions 
        ADD CONSTRAINT contributions_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;
