import AdminCrudPage from "../../components/admin/AdminCrudPage";

export default function AchievementsManager() {
  return (
    <AdminCrudPage
      title="Achievements"
      description="Manage competitions, accomplishments and milestones."
      endpoint="/achievements"
      fields={[
        {
          name: "title",
          label: "Title",
          required: true,
          placeholder: "Solved 150+ DSA Problems",
        },
        {
          name: "date",
          label: "Date",
          placeholder: "2026",
        },
        {
          name: "link",
          label: "Related Link / Proof",
          placeholder: "https://example.com",
          fullWidth: true,
        },
        {
          name: "image",
          label: "Achievement Image / Certificate / Trophy",
          type: "image",
          fullWidth: true,
          help: "Upload an image of your certificate, badge, trophy, or contest rank screenshot (JPG, PNG, WebP)",
        },
        {
          name: "description",
          label: "Description",
          type: "textarea",
          fullWidth: true,
          placeholder: "Describe the achievement.",
        },
        {
          name: "order",
          label: "Display Order",
          type: "number",
          defaultValue: 0,
        },
      ]}
    />
  );
}