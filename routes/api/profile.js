const express = require("express");
const request = require("request");
const config = require("config");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");

const Profile = require("../../models/Profile");
const User = require("../../models/User");
const Post = require("../../models/Post");

// @route   GET api/profile/me
// @desc    Get current users profile
// @access  Private
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "avatar"]
    );

    if (!profile) {
      return res
        .status(400)
        .json({ msg: "There is no profile for this user." });
    }

    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// @route   POST api/profile
// @desc    Create / update user profile
// @access  Private
router.post(
  "/",
  [
    auth,
    [
      check("status", "Status is required")
        .not()
        .isEmpty(),
      check("skills", "Skills is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin
    } = req.body;

    // Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;

    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(",").map(skill => skill.trim());
    }

    // Build social object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        // update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );

        return res.json(profile);
      }

      // create
      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
    }
  }
);

// @route   GET api/profile
// @desc    Get all profiles
// @access  Public
router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);

    res.json(profiles);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public
router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      // coming from the URL above
      user: req.params.user_id
    }).populate("user", ["name", "avatar"]);

    if (!profile) return res.status(400).json({ msg: `Profile not found.` });

    res.json(profile);
  } catch (err) {
    console.error(err);
    if (err.kind == "ObjectId") {
      return res.status(400).json({ msg: `Profile not found.` });
    }
    res.status(500).send("Server Error");
  }
});

// @route   DELETE api/profile
// @desc    DELETE profile, user & posts
// @access  Private
router.delete("/", auth, async (req, res) => {
  try {
    // @todo - remove users posts
    await Post.deleteMany({ user: req.user.id });
    // remove profile
    await Profile.findOneAndRemove({ user: req.user.id });
    // remove user
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: "User deleted." });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// @route   PUT api/profile/experience
// @desc    Add profile experience
// @access  Private
router.put(
  "/experience",
  [
    auth,
    [
      check("title", "Title is required")
        .not()
        .isEmpty(),
      check("company", "Company is required")
        .not()
        .isEmpty(),
      check("from", "From date is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ err: errors.array() });
    }
    // data that's coming in
    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    } = req.body;

    // create new object
    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      // pushes onto the beginning
      profile.experience.unshift(newExp);

      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  }
);

// @route GET api/profile/user/:user_id/experiences
// @desc Get profile experiences
// @access Private
router.get("/user/:user_id/experiences", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      // coming from the URL above
      user: req.params.user_id
    }).populate("user", ["name", "avatar"]);

    if (!profile) return res.status(400).json({ msg: `Profile not found.` });

    res.json(profile.experience);
  } catch (err) {
    res.status(500).send("Server Error");
    // res.status(500).send("Server Error");
  }
});

// @route   GET api/profile/user/experience/:exp_id
// @desc    Get profile experience
// @access  Private
router.get("/user/:user_id/experience/:exp_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      // coming from the URL above
      user: req.params.user_id
    }).populate("user", ["name", "avatar"]);

    if (!profile) return res.status(400).json({ msg: `Profile not found.` });

    for (let i = 0; i < profile.experience.length; i++) {
      if (profile.experience[i]._id === req.params.exp_id) {
        res.json(profile.experience[i]._id);
      }
    }

    // res.json(`${req.params.exp_id} + ${profile.experience[0]._id}`);
  } catch (err) {
    res.status(500).send("Server Error");
    // res.status(500).send("Server Error");
  }
});

// @route   POST api/profile/experience/:exp_id
// @desc    Edit profile experience
// @access  Private
router.post("/experience/:exp_id", auth, async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).send({ err: errors.array() });
  }

  Profile.findOne({ user: req.user.id })
    .then(profile => {
      const experienceIndex = profile.experience
        .map(item => item.id)
        .indexOf(req.params.exp_id);

      let experienceToUpdate = profile.experience[experienceIndex];

      (experienceToUpdate.title = req.body.title),
        (experienceToUpdate.company = req.body.company),
        (experienceToUpdate.location = req.body.location),
        (experienceToUpdate.from = req.body.from),
        (experienceToUpdate.to = req.body.to),
        (experienceToUpdate.current = req.body.current),
        (experienceToUpdate.description = req.body.description);

      profile.save().then(profile => res.json(profile));
    })
    .catch(err => res.status(404).json(err));
});

// @route   GET api/profile/experience/:exp_id
// @desc    Get experience from profile with an Id
// @access  Private
router.get("/experience/:exp_id"),
  auth,
  async (req, res) => {
    try {
      const profile = await Profile.findOne({
        // coming from the URL above
        experience: req.params.exp_id
      }).populate("experience", ["company", "id"]);
      console.log("profile:", profile);
      console.log(req.params.exp_id);
    } catch (err) {
      console.err(err);
      res.status(500).send("Server error");
    }
  };

// @route   PATCH api/profile/experience/:exp_id
// @desc    Edit experience from profile
// @access  Private
router.patch("/experience/:exp_id", auth, async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).send({ err: errors.array() });
    }
    // data that's coming in
    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    } = req.body;

    // create new object
    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    };

    const profile = await Profile.findOne({ user: req.user.id });

    // get edit index
    const editIndex = profile.experience
      .map(item => item.id)
      .indexOf(req.params.exp_id);

    console.log(profile, editIndex);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// @route   DELETE api/profile/experience/:exp_id
// @desc    delete experience from profile
// @access  Private
router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    // Get remove index
    const removeIndex = profile.experience
      .map(item => item.id)
      .indexOf(req.params.exp_id);

    // remove the experience
    profile.experience.splice(removeIndex, 1);

    // persist the action
    await profile.save();

    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// @route   PUT api/profile/education
// @desc    Add profile education
// @access  Private
router.put(
  "/education",
  [
    auth,
    [
      check("school", "School is required")
        .not()
        .isEmpty(),
      check("degree", "Degree is required")
        .not()
        .isEmpty(),
      check("fieldofstudy", "Field of Study is required")
        .not()
        .isEmpty(),
      check("from", "From date is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ err: errors.array() });
    }
    // data that's coming in
    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    } = req.body;

    // create new object
    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      // pushes onto the beginning
      profile.education.unshift(newEdu);

      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  }
);

// @route GET api/profile/user/:user_id/educations
// @desc Get profile educations
// @access Private
router.get("/user/:user_id/educations", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      // coming from the URL above
      user: req.params.user_id
    }).populate("user", ["name", "avatar"]);

    if (!profile) return res.status(400).json({ msg: `Profile not found.` });

    res.json(profile.education);
  } catch (err) {
    res.status(500).send("Server Error");
    // res.status(500).send("Server Error");
  }
});

// @route   GET api/profile/user/:user_id/education/:edu_id
// @desc    Get profile education
// @access  Private
router.get("/user/:user_id/education/:edu_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      // coming from the URL above
      user: req.params.user_id
    }).populate("user", ["name", "avatar"]);

    if (!profile) return res.status(400).json({ msg: `Profile not found.` });

    res.json(profile.education);
  } catch (err) {
    res.status(500).send("Server Error");
    // res.status(500).send("Server Error");
  }
});

// @route   POST api/profile/education/:edu_id
// @desc    Edit profile education
// @access  Private
router.post("/education/:edu_id", auth, async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).send({ err: errors.array() });
  }

  Profile.findOne({ user: req.user.id })
    .then(profile => {
      const educationIndex = profile.education
        .map(item => item.id)
        .indexOf(req.params.edu_id);

      let educationToUpdate = profile.education[educationIndex];

      (educationToUpdate.school = req.body.school),
        (educationToUpdate.degree = req.body.degree),
        (educationToUpdate.fieldofstudy = req.body.fieldofstudy),
        (educationToUpdate.from = req.body.from),
        (educationToUpdate.to = req.body.to),
        (educationToUpdate.current = req.body.current),
        (educationToUpdate.description = req.body.description);

      profile.save().then(profile => res.json(profile));
    })
    .catch(err => res.status(404).json(err));
});

// @route   DELETE api/profile/education/:edu_id
// @desc    delete education from profile
// @access  Private
router.delete("/education/:edu_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    // Get remove index
    const removeIndex = profile.education
      .map(item => item.id)
      .indexOf(req.params.edu_id);

    // remove the education
    profile.education.splice(removeIndex, 1);

    // persist the action
    await profile.save();

    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// @route   GET api/profile/github/:username
// @desc    GET User repos from github
// @access  Public
router.get("/github/:username", async (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        "githubClientId"
      )}&client_secret=${config.get("githubSecret")}`,
      method: "GET",
      headers: { "user-agent": "node.js" }
    };

    request(options, (error, response, body) => {
      if (error) console.error(error);

      if (response.statusCode !== 200) {
        return res.status(404).json({ msg: "No Github profile found." });
      }

      res.json(JSON.parse(body));
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
