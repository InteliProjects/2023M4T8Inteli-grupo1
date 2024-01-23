import styled from 'styled-components';
import Grid from '@mui/material/Grid';

const StyledGrid = styled(Grid)`
  && {
    justify-content: center; 
    align-items: center; 
  }
  &:hover {
    cursor: pointer;
  }
`;

export default StyledGrid;