CREATE TABLE "files" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"file_name" varchar(255) NOT NULL,
	"content_type" varchar(255) NOT NULL
);
