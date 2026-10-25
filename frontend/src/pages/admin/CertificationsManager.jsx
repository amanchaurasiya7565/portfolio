import AdminCrudPage from "../../components/admin/AdminCrudPage";

export default function CertificationsManager() {
  return (
    <AdminCrudPage
      title="Certifications"
      description="Manage your professional certifications."
      endpoint="/certifications"
      fields={[
        {
          name: "name",
          label: "Certification Name",
          required: true,
          placeholder: "Web Development Fundamentals",
        },
        {
          name: "issuer",
          label: "Issuer",
          placeholder: "Certification Provider",
        },
        {
          name: "issueDate",
          label: "Issue Date",
          placeholder: "2025",
        },
        {
          name: "credentialId",
          label: "Credential ID",
          placeholder: "ABC-12345",
        },
        {
          name: "credentialUrl",
          label: "Credential Verification Link",
          placeholder: "https://example.com/verify",
          fullWidth: true,
        },
        {
          name: "image",
          label: "Certificate Image / Badge",
          type: "image",
          fullWidth: true,
          help: "Upload an image of your certificate or credential badge (JPG, PNG, WebP)",
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