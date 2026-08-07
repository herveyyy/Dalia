ALTER TABLE "app_feature" DROP CONSTRAINT "app_feature_app_module_id_key_unique";--> statement-breakpoint
ALTER TABLE "role" DROP CONSTRAINT "role_company_id_name_unique";--> statement-breakpoint
DROP INDEX "activity_log_action_idx";--> statement-breakpoint
DROP INDEX "activity_log_actor_id_idx";--> statement-breakpoint
DROP INDEX "activity_log_company_id_idx";--> statement-breakpoint
DROP INDEX "activity_log_created_at_idx";--> statement-breakpoint
DROP INDEX "activity_log_entity_idx";--> statement-breakpoint
CREATE INDEX "activity_log_action_idx" ON "activity_log" USING btree ("action");--> statement-breakpoint
CREATE INDEX "activity_log_actor_id_idx" ON "activity_log" USING btree ("actor_id");--> statement-breakpoint
CREATE INDEX "activity_log_company_id_idx" ON "activity_log" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "activity_log_created_at_idx" ON "activity_log" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "activity_log_entity_idx" ON "activity_log" USING btree ("entity_type","entity_id");--> statement-breakpoint
ALTER TABLE "app_feature" ADD CONSTRAINT "app_feature_app_module_id_key_unique" UNIQUE("app_module_id","key");--> statement-breakpoint
ALTER TABLE "role" ADD CONSTRAINT "role_company_id_name_unique" UNIQUE("company_id","name");