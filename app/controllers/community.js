const Joi = require("joi");
const { User, Community, Chat } = require("../models/Database");
const { verifyToken } = require("../utils/jwt");
const io = require("socket.io");

module.exports = {
  /**
   * Render community page
   *
   * @param {Request} req The Request object.
   * @param {Response} res The Response object.
   */
  show: async (req, res) => {
    const token = req.cookies.token;
    const username = (await verifyToken(token))?.username;
    const user = await User.findByPk(username);
    const community = await Community.findOne({
      where: { id: req.params.communityId },
    });
    const chats = await Chat.findAll({
      where: { community: community.id },
      order: [["id", "DESC"]],
      limit: 10,
    });

    chats.reverse();

    res.render("community/show", {
      layout: "layouts/community-layout",
      title: "Community",
      chats,
      user,
      community,
    });
  },
};
