import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import LiveFeed from '../pages/LiveFeed';
import axios from 'axios';
import React from 'react';

vi.mock('axios');

describe('LiveFeed Component', () => {
    it('renders live feed articles', async () => {
        const mockArticles = [
            {
                title: 'Breaking News: AI Takes Over',
                publisher: 'TechDaily',
                published_at: '2023-12-04T10:00:00Z',
                category: 'Technology',
                sentiment: 0.8,
                topic_label: 'AI'
            }
        ];
        axios.get.mockResolvedValue({ data: mockArticles });

        render(<LiveFeed />);

        await waitFor(() => {
            expect(screen.getByText('LIVE FEED')).toBeInTheDocument();
        });

        expect(screen.getByText('Breaking News: AI Takes Over')).toBeInTheDocument();
        expect(screen.getByText('TechDaily')).toBeInTheDocument();
    });
});
