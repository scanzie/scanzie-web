CREATE TABLE "project" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"userId" varchar(255) NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "seo_analysis_members" RENAME TO "project_members";--> statement-breakpoint
ALTER TABLE "project_members" DROP CONSTRAINT "seo_analysis_members_seoAnalysisId_seo_analysis_id_fk";
--> statement-breakpoint
ALTER TABLE "project_members" DROP CONSTRAINT "seo_analysis_members_userId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "project_members" DROP CONSTRAINT "seo_analysis_members_seoAnalysisId_userId_pk";--> statement-breakpoint
ALTER TABLE "project_members" ADD CONSTRAINT "project_members_projectId_userId_pk" PRIMARY KEY("projectId","userId");--> statement-breakpoint
ALTER TABLE "seo_analysis" ADD COLUMN "projectId" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "project_members" ADD COLUMN "projectId" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "project" ADD CONSTRAINT "project_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seo_analysis" ADD CONSTRAINT "seo_analysis_projectId_project_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_members" ADD CONSTRAINT "project_members_projectId_project_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_members" ADD CONSTRAINT "project_members_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_members" DROP COLUMN "seoAnalysisId";