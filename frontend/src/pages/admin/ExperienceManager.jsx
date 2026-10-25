import AdminCrudPage from "../../components/admin/AdminCrudPage";

export default function ExperienceManager() {
  return (
    <AdminCrudPage
      title="Experience"
      description="Manage internships, jobs and professional experience."
      endpoint="/experience"
      fields={[
        {
          name: "role",
          label: "Role",
          required: true,
          placeholder: "Software Development Intern",
        },
        {
          name: "company",
          label: "Company",
          required: true,
          placeholder: "XYZ Technologies Pvt. Ltd.",
        },
        {
          name: "location",
          label: "Location",
          placeholder: "Delhi, India",
        },
        {
          name: "startDate",
          label: "Start Date",
          placeholder: "May 2026",
        },
        {
          name: "endDate",
          label: "End Date",
          placeholder: "Present",
        },
        {
          name: "current",
          label: "Current Position",
          type: "checkbox",
          checkboxLabel: "I currently work here",
        },
        {
          name: "technologies",
          label: "Technologies",
          type: "array",
          fullWidth: true,
          placeholder: "React, JavaScript, REST APIs",
          help: "Separate technologies with commas.",
        },
        {
          name: "description",
          label: "Description",
          type: "textarea",
          fullWidth: true,
          placeholder: "Describe your responsibilities and achievements.",
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