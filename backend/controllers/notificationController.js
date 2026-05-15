const Notification = require('../models/Notification');
const User = require('../models/User');

exports.createNotification = async (req, res) => {
  try {
    const { title, message, type, targetRole, priority, recipientIds } = req.body;
    let recipients = [];
    if (recipientIds && recipientIds.length > 0) {
      recipients = recipientIds;
    } else if (targetRole && targetRole !== 'All') {
      const users = await User.find({ role: targetRole }).select('_id');
      recipients = users.map((u) => u._id);
    } else {
      const users = await User.find({}).select('_id');
      recipients = users.map((u) => u._id);
    }
    const notification = await Notification.create({
      title, message, type: type || 'Announcement',
      sender: req.user._id, recipients, targetRole: targetRole || 'All',
      priority: priority || 'Medium',
    });
    res.status(201).json({ success: true, notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      $or: [{ recipients: req.user._id }, { targetRole: 'All' }, { targetRole: req.user.role }],
    })
      .populate('sender', 'name role')
      .sort({ createdAt: -1 })
      .limit(50);
    const withReadStatus = notifications.map((n) => {
      const obj = n.toObject();
      obj.isRead = n.readBy.some((r) => r.user.toString() === req.user._id.toString());
      return obj;
    });
    res.json({ success: true, notifications: withReadStatus });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    const alreadyRead = notification.readBy.some((r) => r.user.toString() === req.user._id.toString());
    if (!alreadyRead) {
      notification.readBy.push({ user: req.user._id });
      await notification.save();
    }
    res.json({ success: true, message: 'Marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
