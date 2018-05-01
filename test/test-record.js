describe('record object', function() {
    it('should POST a record given proper input', function (){
        const newRecord = {
            artist: "Jamiroquai",
            album: "Soundstage Landscape",
            release: "1998",
            genre: "Funny Hats",
            label: "Moving Floor Records"
    };
        const expectedKeys = ['id', 'publishDate'].concat(Object.keys(newPost));
        
        return chai.request(app) 
            .post('/collection')
            .send(newRecord)
            .then(function(res) {
                expect(res).to.have.status(201);
                expect(res).to.be.json;
                expect(res).to.be.a('object');
                expect(res.body).to.have.all.keys(expectedKeys);
                expect(res.body.artist).to.equal(newRecord.artist);
                expect(res.body.album).to.equal(newRecord.album);
                expect(res.body.release).to.equal(Date(newRecord.release));
                expect(res.body.genre).to.equal(newRecord.genre);
                expect(res.body.label).to.equal(newRecord.label);
            })
        ;
    });

    it('should error if POST does not contain expected keys', function () {
        const badRequestData = {};
            return chai.request(app)
            .post('/collection')
            .send(badRequestData)
            .catch(function (res) {
                expect(res).to.have.status(400);
            })
        ;
    });
});

    it('should GET a record given a valid ID', function () {

    });

    it('should PUT a user edit to an existing record given a valid ID', function () {    
    });

    it('should DELETE a record given a valid ID', function () {

    });
