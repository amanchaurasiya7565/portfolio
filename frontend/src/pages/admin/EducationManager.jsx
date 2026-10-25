import AdminCrudPage from "../../components/admin/AdminCrudPage";

export default function EducationManager() {
  return (
    <AdminCrudPage
      title="Education"
      description="Manage your academic background."
      endpoint="/education"
      fields={[
        {
          name: "degree",
          label: "Degree",
          required: true,
          placeholder: "B.Tech Computer Science",
        },
        {
          name: "institution",
          label: "Institution",
          required: true,
          placeholder: "ABC Institute of Technology",
        },
        {
          name: "location",
          label: "Location",
          placeholder: "Delhi, India",
        },
        {
          name: "startYear",
          label: "Start Year",
          type: "number",
          placeholder: "2023",
        },
        {
          name: "endYear",
          label: "End Year",
          type: "number",
          placeholder: "2027",
        },
        {
          name: "grade",
          label: "Grade / CGPA",
          placeholder: "8.2 / 10",
        },
        {
          name: "description",
          label: "Description",
          type: "textarea",
          fullWidth: true,
          placeholder: "Relevant coursework, activities, etc.",
        },
        {
          name: "order",
          label: "Display Order",
          type: "number",
          defaultValue: 0,
          help: "Lower numbers appear first.",
        },
      ]}
    />
  );
}