import { styled, useTheme } from '@mui/system';
import { Link } from 'react-router-dom';

const PageContainer = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'light' ? '#f6f6f6' : '#0f0f0f',
  minHeight: '83vh', // Pour s'assurer que le conteneur occupe au moins toute la hauteur de la fenêtre
}));

const CardContainer = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  maxWidth: '300px',
  height: '200px',
  margin: '20px',
  marginTop:'50px',
  backgroundColor: theme.palette.mode === 'light' ? '#ededed' : '#333',
  color: theme.palette.mode === 'light' ? 'black' : 'white',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  cursor: 'pointer',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

//#f0f0f0
const CardContent = styled('div')({
  textAlign: 'center',
});

const CardRow = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  gap: '20px',
});

const Dashboard = () => {
  const theme = useTheme();

  return (
    <PageContainer>
      <CardRow>
        <CardContainer to="/manager/article">
          <CardContent>
            <h2>Article</h2>
            <p>Gérer les articles</p>
          </CardContent>
        </CardContainer>
        <CardContainer to="/manager/liste-piece-rechange">
          <CardContent>
            <h2>Piéces de rechange</h2>
            <p>Gérer les pièces de rechange</p>
          </CardContent>
        </CardContainer>
      </CardRow>
      <CardRow>
      <CardContainer to="/manager/nature">
          <CardContent>
            <h2>Nature</h2>
            <p>Gérer les natures</p>
          </CardContent>
        </CardContainer>
        <CardContainer to="/manager/cause">
          <CardContent>
            <h2>Cause</h2>
            <p>Gérer les causes</p>
          </CardContent>
        </CardContainer>
        <CardContainer to="/manager/type">
          <CardContent>
            <h2>Type</h2>
            <p>Gérer les types</p>
          </CardContent>
        </CardContainer>
      </CardRow>
    </PageContainer>
  );
};

export default Dashboard;
