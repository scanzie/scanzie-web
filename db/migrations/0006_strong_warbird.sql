CREATE TABLE "seo_analysis_members" (
	"seoAnalysisId" uuid NOT NULL,
	"userId" varchar(255) NOT NULL,
	"role" varchar(50) DEFAULT 'member' NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "seo_analysis_members_seoAnalysisId_userId_pk" PRIMARY KEY("seoAnalysisId","userId")
);
--> statement-breakpoint
ALTER TABLE "seo_analysis_members" ADD CONSTRAINT "seo_analysis_members_seoAnalysisId_seo_analysis_id_fk" FOREIGN KEY ("seoAnalysisId") REFERENCES "public"."seo_analysis"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seo_analysis_members" ADD CONSTRAINT "seo_analysis_members_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seo_analysis" DROP COLUMN "owners";