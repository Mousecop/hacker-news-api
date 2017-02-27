const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const faker = require('faker');
const {HackerNews} = require('../model');
const should = chai.should();

mongoose.Promise = global.Promise;

const {app, runServer, closeServer} = require('../server');
chai.use(chaiHttp);



function seedData() {
    console.info('Seeding data');
    const seedData = [];
  for (let i=1; i<=10; i++) {
    seedData.push(
      generateNewspost()
    );
  };
  return HackerNews.insertMany(seedData);

}


function generateNewspost() {
  return {
     
    title: faker.lorem.sentence(),
    url: faker.internet.domainName(),
    votes: faker.random.number()
  }
}


function tearDownDb() {
  console.info('Deleting database');
  return mongoose.connection.dropDatabase();
}







describe('Hacker News API', function() {
  before(function() {
    return runServer();
  });

  beforeEach(function() {
    return seedData();
  });

  afterEach(function() {
    return tearDownDb();
  });

  after(function() {
    return closeServer();
  })
 describe('testing Get EndPoint', function() {
    it('Getting all objects', function() {
      let res;
      return chai.request(app)
      .get('/stories')
      .then(function(_res){
        res = _res;
        res.should.have.status(200);
        res.body.should.have.length.of.at.least(1);
        return HackerNews.count();
      })
     .then(function(count){
        res.body.should.have.length.of(count);
      });
    });
  });





  describe('testing POST EndPoint', function() {
    it('Posting a new story', function(){
      var newStory = generateNewspost()

      return chai.request(app)
      .post('/stories')
      .send(newStory)
      .then(function(res){
        res.should.have.status(201)
        res.should.be.json
        res.body.should.be.a('object')
        res.body.should.include.keys('title', 'url', 'votes')
      })
    });
  });


  describe('testing Put endpoint', function(){
    it('should update votes ONLYYYYY', function(){
      var votes = {};
      return HackerNews
      .findOne()
      .exec()
      .then(function(article){
        votes = {
          id: article.id,
          numOfVotes: article.votes
        }
        return chai.request(app)
          .put(`/stories/${article.id}`);
      })
      .then(function(res){
        res.should.have.status(204);
        console.log(res.body.votes + "here")
        return HackerNews.findOne({_id:votes.id}).exec();
      })
      .then(function(story){
        console.log('check story');
        story.votes.should.equal(votes.numOfVotes+1);
      });
    })
  })

});













