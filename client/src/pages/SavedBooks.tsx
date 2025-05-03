import { Container, Card, Button, Row, Col } from 'react-bootstrap';


import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from '../graphql/queries';
import { REMOVE_BOOK } from '../graphql/mutations';

const SavedBooks = () => {
  const { data, loading, error } = useQuery(GET_ME);
  const [removeBook] = useMutation(REMOVE_BOOK);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading data.</div>;

  interface SavedBook {
    bookId: string;
    title: string;
    authors: string[];
    description: string;
    image?: string;
  }

  interface UserData {
    username: string;
    savedBooks: SavedBook[];
  }

  const userData: UserData | undefined = data?.me;

  const handleDeleteBook = async (bookId: string) => {
    try {
      await removeBook({
        variables: { bookId },
        update: (cache) => {
          const existing = cache.readQuery<{ me: UserData }>({ query: GET_ME });
          if (existing?.me?.savedBooks) {
            cache.writeQuery({
              query: GET_ME,
              data: {
                me: {
                  ...existing.me,
                  savedBooks: existing.me.savedBooks.filter((book: SavedBook) => book.bookId !== bookId),
                },
              },
            });
          }
        },
      });
    } catch (err) {
      console.error('Error in handleDeleteBook:', err);
    }
  };

  if (!userData) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <div className='text-light bg-dark p-5'>
        <Container>
          {userData.username && (
            <h1>Viewing {userData.username}'s saved books!</h1>
          )}
          {/* {userData.savedBooks.map((book: SavedBook) => (
            <div key={book.bookId}></div>
          ))} */}
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${
                userData.savedBooks.length === 1 ? 'book' : 'books'
              }:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData.savedBooks.map((book) => {
            return (
              <Col md='4' key={book.bookId}>
                <Card border='dark'>
                  {book.image && (
                    <Card.Img
                      src={book.image}
                      alt={`The cover for ${book.title}`}
                      variant='top'
                    />
                  )}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button
                      className='btn-block btn-danger'
                      onClick={() => handleDeleteBook(book.bookId)}
                    >
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
