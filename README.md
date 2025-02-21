# Voting_App
Node Js project

voting app functionality 

    A functionality where user can give vote to the set of candidates.
1. User sign in/ sign up
2. see the list of candidate
3. vote one of the candidate
4. there is a route which shows the list of candidate and their live vote count sorted by vote
count
5. user data must contain unique id or Adhar number
6. there should be one admin who is maintaining the table of candidate and he is not able to vote.
7. user can change their password
8. user can login only with adhar number and password


Routes

user Authentication
    /signup: post - create a new user account 
    /signin: post - login to an existing account [adhar number + password]

voting
    /candidates: get - Get the list of candidates
    /vote/:candidateId post - vote for specific candidate

vote counts 
    /vote/counts: get - Get the list of candidates sorted by vote counts 

User profile
    /profile: get - Get the user profile information
    /profile/password: put - change the user password

Admin candidate management
    /candidates: post - Create a new candidate
    /candidates/:candidateId: put - update an existing candidate
    /candidates/:canfdidateId: DELETE - delete a candidate from the list 

