type AsyncTypeaheadRef = import('react-bootstrap-typeahead').AsyncTypeahead<{
  id: string;
  label: string;
}> & {clear?: () => void }
