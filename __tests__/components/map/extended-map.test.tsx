import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import { afterEach, describe, it, vi } from 'vitest';
import ExtendedMap from '~/components/map/extended-map';
 
describe('Page', () => {
  const createObjectURL = vi.fn();
  window.URL.createObjectURL = createObjectURL;

  afterEach(() => {
    createObjectURL.mockReset();
  });

  it('renders a heading', () => {
    let mapRef = undefined;
    render(<ExtendedMap ref={(ref) => { mapRef = ref }}  />)
    console.log(mapRef);
    // const heading = screen.getByRole('heading', { level: 1 })
 
    // expect(heading).toBeInTheDocument()
  })
})