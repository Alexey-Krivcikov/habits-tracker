CREATE TABLE "success_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"situation" text NOT NULL,
	"achievement" text NOT NULL,
	"emotion" text NOT NULL,
	"thought" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
