BEGIN;

CREATE TABLE IF NOT EXISTS public.user_roles
(
    user_id integer NOT NULL,
    role_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT user_roles_pkey PRIMARY KEY (user_id, role_id)
);

CREATE INDEX IF NOT EXISTS idx_user_roles_user_id
    ON public.user_roles(user_id);

CREATE INDEX IF NOT EXISTS idx_user_roles_role_id
    ON public.user_roles(role_id);

ALTER TABLE IF EXISTS public.user_roles
    ADD CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id)
    REFERENCES public.users (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE;

ALTER TABLE IF EXISTS public.user_roles
    ADD CONSTRAINT fk_user_roles_role FOREIGN KEY (role_id)
    REFERENCES public.roles (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE;

INSERT INTO public.roles (role_name, role_desc)
VALUES
    ('platform_admin', 'Global platform administrator'),
    ('marketplace_only', 'Marketplace-only platform user'),
    ('org_admin', 'Organization administrator'),
    ('org_member', 'Organization member')
ON CONFLICT (role_name) DO NOTHING;

COMMIT;
