-- Enable RLS and add policies for core tables.
-- Apply after migrations with a superuser and session role configured by API.

ALTER TABLE "Submission" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ModerationAction" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TagReview" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CuratedFlow" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AuditLog" ENABLE ROW LEVEL SECURITY;

-- Example policies; API must set session vars:
-- SET app.user_id = '<uuid>';
-- SET app.user_role = 'regional_manager';
-- SET app.user_region = '<region_code>';

CREATE POLICY submission_public_read
  ON "Submission"
  FOR SELECT
  USING (status = 'approved');

CREATE POLICY submission_authenticated_write
  ON "Submission"
  FOR INSERT
  WITH CHECK (current_setting('app.user_id', true) IS NOT NULL);

CREATE POLICY submission_manager_scope
  ON "Submission"
  FOR SELECT
  USING (
    current_setting('app.user_role', true) IN ('regional_manager','nordic_manager','european_manager','global_manager')
  );
