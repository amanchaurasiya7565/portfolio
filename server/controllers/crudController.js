export const createCrudController = (Model) => ({
  getAll: async (req, res) => {
    try {
      const items = await Model.find().sort({
        order: 1,
        createdAt: -1,
      });

      res.json(items);
    } catch (error) {
      res.status(500).json({
        message: "Failed to fetch data",
        error: error.message,
      });
    }
  },

  create: async (req, res) => {
    try {
      const item = await Model.create(req.body);

      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({
        message: "Failed to create item",
        error: error.message,
      });
    }
  },

  update: async (req, res) => {
    try {
      const item = await Model.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

      if (!item) {
        return res.status(404).json({
          message: "Item not found",
        });
      }

      res.json(item);
    } catch (error) {
      res.status(400).json({
        message: "Failed to update item",
        error: error.message,
      });
    }
  },

  remove: async (req, res) => {
    try {
      const item = await Model.findByIdAndDelete(
        req.params.id
      );

      if (!item) {
        return res.status(404).json({
          message: "Item not found",
        });
      }

      res.json({
        message: "Item deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to delete item",
        error: error.message,
      });
    }
  },
});