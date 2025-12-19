import { render, screen, fireEvent } from '@testing-library/react';
import Reports from '../pages/Reports';
import React from 'react';

describe('Reports Component', () => {
    it('renders the reports table', () => {
        render(<Reports />);
        expect(screen.getByText('REPORTS')).toBeInTheDocument();
        expect(screen.getByText('Document Name')).toBeInTheDocument();
        expect(screen.getByText('Daily Intelligence Briefing')).toBeInTheDocument();
    });

    it('filters reports based on search input', () => {
        render(<Reports />);
        const searchInput = screen.getByPlaceholderText('Search reports...');

        // Search for "Cybersecurity"
        fireEvent.change(searchInput, { target: { value: 'Cybersecurity' } });

        expect(screen.getByText('Cybersecurity Threat Landscape')).toBeInTheDocument();
        expect(screen.queryByText('Daily Intelligence Briefing')).not.toBeInTheDocument();
    });
});
