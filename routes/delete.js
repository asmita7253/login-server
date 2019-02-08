/**
 * /delete routes
 */

const utils = require("../utils")
const events = require("../lib/events")
const User = require("../models/user")

module.exports = app => {

  app.get("/delete", (req, res) => {
    res.render("delete", {
      user: req.user,
      messages: utils.flashMessages(req),
    })
  })

  // We need to use POST here because DELETE can't be opened by the browser.
  app.post("/delete", async (req, res) => {
    let user = req.user
    await req.logout()
    User.findByIdAndRemove(user.id).then(() => {
    // Fire loggedOut event
      events.userLoggedOut(req.sessionID)
      req.flash("success", "Your user account was deleted.")
    }).catch(() => {
      req.flash("error", "There was an error when trying to delete your user account.")
    }).finally(() => {
      req.user = undefined
      res.redirect("/login")
    })
  })

}
