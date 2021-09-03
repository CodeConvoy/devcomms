import ChatIcon from '@material-ui/icons/Chat';
import DescriptionIcon from '@material-ui/icons/Description';
import ListIcon from '@material-ui/icons/List';
import BrushIcon from '@material-ui/icons/Brush';

// returns icon for given type
export default function getIcon(type) {
  switch (type) {
    case 'text': return <ChatIcon />;
    case 'notes': return <DescriptionIcon />;
    case 'sketch': return <BrushIcon />;
    case 'todos': return <ListIcon />;
    default: return null;
  }
}
