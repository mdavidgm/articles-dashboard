import { useEffect } from 'react';
import { useAppStore } from '../../store';

const HighlightSection = () => {
  const isHighlightsLoading = useAppStore((state) => state.highlightsIsLoading);
  const highlightsError = useAppStore((state) => state.highlightsError);
  const fetchHighlights = useAppStore((state) => state.fetchHighlights);

  useEffect(() => {
    fetchHighlights();
  }, [fetchHighlights]);

  if (isHighlightsLoading) {
    return (
      <>
        <div>Loading highlights...</div>
      </>
    );
  }

  if (highlightsError) {
    return (
      <p>{highlightsError}</p>
    );
  }

  return <>
    <p>Highlights section is ready!</p>
  </>
};

export default HighlightSection;