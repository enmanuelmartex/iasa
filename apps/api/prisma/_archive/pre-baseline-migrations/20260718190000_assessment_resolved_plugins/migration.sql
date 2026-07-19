ALTER TABLE "assessment_configs"
ADD COLUMN "resolvedPlugins" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
