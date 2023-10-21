import chai from "chai";
import chaiHttp from "chai-http";
import app from '../app.js';

const expect = chai.expect;

chai.use(chaiHttp);

describe('List Books', ()=>{
    it('should list all books', (done) =>{
        chai.request(app)
        .get('/books/')
        .auth('islam', 'islam')
        .end((err, res)=>{
            expect(res).to.have.status(201);
            expect(res.body).to.be.an('array');
            done();
        })
    })
})

describe('Delete Book', () => {
    it('Should delete a book', (done) => {
     
      const bookIdToDelete = 12; // Replace with an existing book ID
  
      chai.request(app)
        .delete(`/books/${bookIdToDelete}`)
        .auth('islam', 'islam')
        .end((err, res) => {
            if (err) return done(err);
            expect(res.text).to.equal('Book deleted');
            done();
        });
    });
});

describe('Create Book Route', () => {
    it('should create a book', (done) => {
      const newBook = {// Change isbn before run test 
        title: 'Engilsh Book',
        author: 'John Doe',
        isbn: '1234567',
        quantity: 10,
        shelf_location: 'A1',
      };
  
      chai.request(app)
        .post('/books/create-book')
        .auth('islam', 'islam')
        .send(newBook)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.text).to.equal('Book created');
          expect(res).to.have.status(201)
          done();
        });
    });
  });

  describe('Update Book Route', () => {
    it('should update a book', (done) => {
      const bookId = 11; // Replace with an existing book ID
      const updatedBook = {
        title: 'Updated Book',
        author: 'Updated Author',
        isbn: '98765432',
        quantity: 5,
        shelf_location: 'B2',
      };
  
      chai.request(app)
        .put(`/books/${bookId}`)
        .auth('islam', 'islam')
        .send(updatedBook)
        .end((err, res) => {
          if (err) return done(err);
          expect(res).to.have.status(201);
          expect(res.text).to.equal('Book updated');
          done();
        });
    });
  });

  describe('Search Books Route', () => {
    it('should return a list of books', (done) => {
      const query = 'ali'; // Replace with a search query
      
    //   const expectedResult = [{ title: 'Sample Book', author: 'John Doe', isbn: '1234567890' }];
  
      chai.request(app)
        .get('/books/search-books')
        .auth('islam', 'islam')
        .query({ query })
        .end((err, res) => {
          if (err) return done(err);
          expect(res).to.have.status(201);
          expect(res.body).to.be.an('array');
          done();
        });
    });
  
    it('should handle no results', (done) => {
      const query = 'nonexistent'; // Replace with a search query that has no results
  
      chai.request(app)
        .get('/books/search-books')
        .auth('islam', 'islam')
        .query({ query })
        .end((err, res) => {
            if (err) return done(err);
            expect(res).to.have.status(404);
            expect(res.text).to.equal('No books found matching the search criteria');
            done();
          });
    });
  });