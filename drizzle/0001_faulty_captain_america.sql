CREATE TABLE "store_transfer" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"store_id" uuid NOT NULL,
	"from_user_id" text NOT NULL,
	"to_user_id" text NOT NULL,
	"admin_id" text NOT NULL,
	"was_activated" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "store_page" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"store_id" uuid NOT NULL,
	"type" varchar(30) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"content" text,
	"seo_title" text,
	"seo_description" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "store_product_collection" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"store_id" uuid NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"description" text,
	"image_url" text,
	"seo_title" text,
	"seo_description" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "store_product" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"store_id" uuid NOT NULL,
	"collection_id" uuid,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text,
	"long_description" text,
	"price_in_cents" integer NOT NULL,
	"original_price_in_cents" integer,
	"images" jsonb,
	"cta_mode" varchar(20) DEFAULT 'WHATSAPP' NOT NULL,
	"cta_label" varchar(80) DEFAULT 'Comprar',
	"cta_external_url" text,
	"cta_whatsapp_message" text,
	"seo_title" text,
	"seo_description" text,
	"status" varchar(20) DEFAULT 'ACTIVE' NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "store_pricing_plan" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"store_id" uuid NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"price_in_cents" integer NOT NULL,
	"interval" varchar(20) DEFAULT 'MONTHLY' NOT NULL,
	"features" jsonb,
	"is_highlighted" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"cta_mode" varchar(20) DEFAULT 'WHATSAPP' NOT NULL,
	"cta_label" varchar(80) DEFAULT 'Assinar',
	"cta_external_url" text,
	"cta_whatsapp_message" text,
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "store_template" (
	"id" varchar(50) PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"supported_modes" jsonb NOT NULL,
	"available_sections" jsonb NOT NULL,
	"thumbnail_url" text,
	"preview_url" text,
	"is_public" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "category" ALTER COLUMN "seo_title" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "category" ALTER COLUMN "seo_description" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "category" ALTER COLUMN "hero_title" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "store" ALTER COLUMN "hero_title" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "store" ALTER COLUMN "hero_subtitle" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "store" ALTER COLUMN "seo_title" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "store" ALTER COLUMN "seo_description" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "impersonated_by" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "phone" varchar(20);--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "role" text DEFAULT 'user';--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "banned" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "ban_reason" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "ban_expires" integer;--> statement-breakpoint
ALTER TABLE "category" ADD COLUMN "type_google_place" jsonb;--> statement-breakpoint
ALTER TABLE "category" ADD COLUMN "applicable_modes" jsonb DEFAULT '["LOCAL_BUSINESS"]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "store" ADD COLUMN "hero_background_color" varchar(7) DEFAULT '#1e293b';--> statement-breakpoint
ALTER TABLE "store" ADD COLUMN "button_color" varchar(7) DEFAULT '#22c55e';--> statement-breakpoint
ALTER TABLE "store" ADD COLUMN "stats" jsonb;--> statement-breakpoint
ALTER TABLE "store" ADD COLUMN "whatsapp_default_message" varchar(300);--> statement-breakpoint
ALTER TABLE "store" ADD COLUMN "instagram_url" text;--> statement-breakpoint
ALTER TABLE "store" ADD COLUMN "facebook_url" text;--> statement-breakpoint
ALTER TABLE "store" ADD COLUMN "google_business_url" text;--> statement-breakpoint
ALTER TABLE "store" ADD COLUMN "font_family" varchar(50);--> statement-breakpoint
ALTER TABLE "store" ADD COLUMN "highlight_badge" varchar(50);--> statement-breakpoint
ALTER TABLE "store" ADD COLUMN "highlight_text" text;--> statement-breakpoint
ALTER TABLE "store" ADD COLUMN "mode" varchar(20) DEFAULT 'LOCAL_BUSINESS' NOT NULL;--> statement-breakpoint
ALTER TABLE "store" ADD COLUMN "sections" jsonb;--> statement-breakpoint
ALTER TABLE "store" ADD COLUMN "template_id" varchar(50) DEFAULT 'default' NOT NULL;--> statement-breakpoint
ALTER TABLE "store" ADD COLUMN "template_config" jsonb;--> statement-breakpoint
ALTER TABLE "store" ADD COLUMN "term_gender" varchar(10) DEFAULT 'FEMININE' NOT NULL;--> statement-breakpoint
ALTER TABLE "store" ADD COLUMN "term_number" varchar(10) DEFAULT 'SINGULAR' NOT NULL;--> statement-breakpoint
ALTER TABLE "store" ADD COLUMN "site_blueprint_v2" jsonb;--> statement-breakpoint
ALTER TABLE "store" ADD COLUMN "site_blueprint_v2_generated_at" timestamp;--> statement-breakpoint
ALTER TABLE "service" ADD COLUMN "slug" varchar(255);--> statement-breakpoint
ALTER TABLE "service" ADD COLUMN "seo_title" text;--> statement-breakpoint
ALTER TABLE "service" ADD COLUMN "seo_description" text;--> statement-breakpoint
ALTER TABLE "service" ADD COLUMN "long_description" text;--> statement-breakpoint
ALTER TABLE "service" ADD COLUMN "hero_image_url" text;--> statement-breakpoint
ALTER TABLE "service" ADD COLUMN "icon_name" varchar(50);--> statement-breakpoint
ALTER TABLE "store_transfer" ADD CONSTRAINT "store_transfer_store_id_store_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."store"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store_transfer" ADD CONSTRAINT "store_transfer_from_user_id_user_id_fk" FOREIGN KEY ("from_user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store_transfer" ADD CONSTRAINT "store_transfer_to_user_id_user_id_fk" FOREIGN KEY ("to_user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store_transfer" ADD CONSTRAINT "store_transfer_admin_id_user_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store_page" ADD CONSTRAINT "store_page_store_id_store_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."store"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store_product_collection" ADD CONSTRAINT "store_product_collection_store_id_store_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."store"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store_product" ADD CONSTRAINT "store_product_store_id_store_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."store"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store_product" ADD CONSTRAINT "store_product_collection_id_store_product_collection_id_fk" FOREIGN KEY ("collection_id") REFERENCES "public"."store_product_collection"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store_pricing_plan" ADD CONSTRAINT "store_pricing_plan_store_id_store_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."store"("id") ON DELETE cascade ON UPDATE no action;