import Notice from "../models/Notice.js";

export const createNotice = async (req, res, next) => {
  try {
    const notice = await Notice.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json(notice);
  } catch (error) {
    next(error);
  }
};

// Returns notices relevant to the logged-in user's role ("all" + their own role)
export const getNotices = async (req, res, next) => {
  try {
    const notices = await Notice.find({
      $or: [{ targetRole: "all" }, { targetRole: req.user.role }],
    })
      .populate("createdBy", "name role")
      .sort({ createdAt: -1 });
    res.json(notices);
  } catch (error) {
    next(error);
  }
};

export const deleteNotice = async (req, res, next) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);
    if (!notice) return res.status(404).json({ message: "Notice not found" });
    res.json({ message: "Notice deleted" });
  } catch (error) {
    next(error);
  }
};
