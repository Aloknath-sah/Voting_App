const express = require('express');
const router = express.Router();
const candidate = require('../models/candidate');
const {jwtAuthMiddleware, generateToken} = require('../jwt');
const User = require('../models/users');
const Candidate = require('../models/candidate');

//we have to check first the role is admin or not because only admin can update the candidate
const checkAdminRole = async (userId) => {
    try {
        const user = await User.findById(userId);
        if(user.role == 'admin') {
            return true;
        }
    }
    catch(err) {
        return false;
    }
}

//Post route to add candidate
router.post('/', jwtAuthMiddleware, async (req, res) => {
    try{
        if(!(await checkAdminRole(req.user.id))) {
            return res.status(403).json({message: 'user do not have admin role'})
        }

        //Assuming the req body contains candidate data
        const data = req.body;

        //create a new user doc using mongoose model
        const newCandidate = new Candidate(data);

        //save the new user to the database
        const response = await newCandidate.save();
        console.log('data saved')
        res.status(200).json({response: response})
    }
    catch(err) {
        console.log(err);
        res.status(500).json({error: 'Internal server error'})
    }
})

//Put method for updation of candidate data
router.put('/:candidateId', jwtAuthMiddleware, async (req, res) => {
    try {
        if(!checkAdminRole(req.user.id)) {
            return res.status(400).json({message: 'user does not have admin permission'})
        }
        const candidateId = req.params.candidateId;
        const updatedCandidateData = req.body;

        const response = await Candidate.findByIdAndUpdate(candidateId, updatedCandidateData, {
            new: true,
            runValidators: true
        })

        if(!response) {
            return res.status(400).json({error: 'Candidate not found'})
        }
        console.log('candidate data updated');
        res.status(200).json(response);
    }
    catch(err) {
        console.log(err);
        res.status(500).json({error: 'Internal server error'})
    }
})

router.delete('/:candidateId', jwtAuthMiddleware, async (req, res) => {
    if(!checkAdminRole(req.user.id)) {
        return res.status(400).json({error: 'user does not have admin role'})
    }
    try {
        const candidateId = req.params.candidateId;
        const response = await Candidate.findByIdAndDelete(candidateId);
        if(!response) {
            return res.status(400).json({message: 'candidate not found'})
        }
        res.status(200).json(response)
    }
    catch(err) {
        res.status(400).json({error: 'Internal server error'})
    }
})

//creating voting feature for voters
router.get('/vote/:candidateId', jwtAuthMiddleware, async (req, res) => {
    //no admin can vote
    //user can vote only once
    try{
        const candidateId = req.params.candidateId;
        const userId = req.user.id;

        const candidate = await Candidate.findById(candidateId);
        if(!candidate) {
            return res.status(400).json({message: 'Candidate not found'})
        }

        const user = await User.findById(userId);
        if(!user) {
            return res.status(400).json({message: 'User not found'});
        }

        if(user.role == 'admin') {
            return res.status(400).json({message: 'admin are not allowed to vote'})
        }

        if(user.isVoted) {
            return res.status(400).json({message: 'already voted'})
        }

        //updating the candidate document to record vote
        candidate.votes.push({user: userId})
        candidate.voteCount++
        await candidate.save();

        //update the user document
        user.isVoted = true;
        await user.save();

        return res.status(200).json({message: 'Vote recorded successfully'})
    }
    catch(err) {
        console.log(err);
        res.status(400).json({error: 'Internal server error'})
    }
})

router.get('/vote/count', async (req, res) => {
    try {
        //find candidate and sort them in desc order by votecount
        const candidate = await Candidate.find().sort({voteCount: 'desc'})

        //map the candidates to only return their name and votecount
        const voteRecord = candidate.map((data) => {
            return {
                party: data.party,
                count: data.voteCount
            }
        })
        return res.status(200).json(voteRecord);
    }
    catch(err) {
        console.log(err);
        res.status(400).json({error: 'Internal server error'})
    }
})

//get all candidates with only name and party fields
router.get('/', async (req, res) => {
    try {
        const candidates = await Candidate.find({}, 'name party -_id' );
        res.status(200).json(candidates)
    }
    catch(err) {
        console.log(err);
        res.status(400).json({error: 'Internal server error'})
    }
})

module.exports = router;
