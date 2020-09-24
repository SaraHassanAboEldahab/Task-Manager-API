const express = require('express')
const Task = require('../models/task')
const auth = require("../middleware/auth")
const { query } = require('express')
const router = new express.Router()

router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})
////////////////////// 3. Filtering Data , 4. Paginating Data & 5. Sorting Data //////////////////////

router.get('/tasks', auth, async (req, res) => {
    const match = {}
    if (req.query.completed) {
        //l fekra hena n (mach.completed) is a boolean but (req.query.completed) is a string w na 3yzaha boolean 3shan kda ast5dmt l (===) w dbtrg3ly boolean
        //y3ny hena lw req.query.completed kant true fel url fa kda (req.query.completed==="true" ) hatb2a true ka boolean w lw false hatb2a l 3ks
        match.completed = req.query.completed === "true"
    }

    const sort = {}
    if (req.query.sortBy) {
        //l mafrod n sortBy option zay l limit w skip bardo bs l fekra hena enha mtkwna mn goz2yn elawl hwa l field l ha3ml sorting 3ala asaso wel tany hwa asc wla dsc
        //3shan kda ast5dmt l split w b3d kda a2dr ast5m l na 3ayza b rakm l index
        //parts[1] kan acs kda hyb2a true w hayb2a l sort = 1 w lw false hatb2a =-1
        const parts = req.query.sortBy.split(":")//mmkn under score ( _ ) bdl : 3ady
        sort[parts[0]] = parts[1] === "acs" ? 1 : -1;
    }
    try {
        // await req.user.populate("tasks").execPopulate()

        //a7na hena han7dd l tasks l 3ayznha y3ny masln ngeb l tasks l true bs, w 3shan a3ml da harg3 gwa l populate object
        await req.user.populate({
            path: "tasks",//nfs l fkra bs hena 7atet l tasks fel path w b3d kda a7dd anhy tasks 3ayzaha, w lw ktbt l path bs w maktbtsh l match kda hatrg3ly kol l tasks bs bardo
            //match is an object and in here we can specify exactly which tasks we want
            match,

            //options used for pagination and also for sorting
            options: {
                //ast5dmna l parseInt 3shan zay fo2 bardo req.query 3amtn hya string w na 3ayzaha numbers
                limit: parseInt(req.query.limit),//da rakm l tasks l 3yzahom fel page elwa7da
                skip: parseInt(req.query.skip),//da rakm l tasks l 3ayza a3mlhom skip 7asb na 3ayza anhy page
                //ama ast5dmt l completed wel limit wel skip ma3 b3d fel url b2a masln lw katba kda (/tasks?completed=false&limit=4&skip=2) da kda m3nah a3ml skip le awl 2 false w hatly 4 false b3dom
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const task = await Task.findOne({ _id, owner: req.user._id })
        if (!task) {
            return res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })
        if (!task) {
            return res.status(404).send()
        }
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()

        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
        if (!task) {
            res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router