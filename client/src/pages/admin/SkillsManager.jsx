import { useEffect, useState } from "react";
import api from "../../services/api";

const initialForm = {
  category: "Programming",
  name: "",
  level: 70,
  order: 0,
};

export default function SkillsManager() {
  const [skills, setSkills] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

  const fetchSkills = async () => {
    try {
      const { data } = await api.get("/skills");
      setSkills(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(`/skills/${editingId}`, form);
      } else {
        await api.post("/skills", form);
      }

      setForm(initialForm);
      setEditingId(null);

      fetchSkills();
    } catch (error) {
      console.error(error);
    }
  };

  const editSkill = (skill) => {
    setEditingId(skill._id);

    setForm({
      category: skill.category,
      name: skill.name,
      level: skill.level,
      order: skill.order,
    });
  };

  const deleteSkill = async (id) => {
    if (!window.confirm("Delete this skill?")) return;

    try {
      await api.delete(`/skills/${id}`);
      fetchSkills();
    } catch (error) {
      console.error(error);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(initialForm);
  };

  return (
    <div>
      <h1>Skills</h1>

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Skill name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
        >
          <option>Programming</option>
          <option>Frontend</option>
          <option>Backend</option>
          <option>Database</option>
          <option>Tools</option>
          <option>Core Concepts</option>
        </select>

        <input
          name="level"
          type="number"
          min="0"
          max="100"
          value={form.level}
          onChange={handleChange}
        />

        <input
          name="order"
          type="number"
          value={form.order}
          onChange={handleChange}
        />

        <button type="submit">
          {editingId ? "Update Skill" : "Add Skill"}
        </button>

        {editingId && (
          <button type="button" onClick={cancelEdit}>
            Cancel
          </button>
        )}
      </form>

      <hr />

      {skills.map((skill) => (
        <div key={skill._id}>
          <strong>{skill.name}</strong>

          <span>
            {" "}
            — {skill.category} — {skill.level}%
          </span>

          <button onClick={() => editSkill(skill)}>
            Edit
          </button>

          <button onClick={() => deleteSkill(skill._id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}