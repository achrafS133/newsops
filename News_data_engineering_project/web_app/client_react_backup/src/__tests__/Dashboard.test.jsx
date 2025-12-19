import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import Dashboard from '../pages/Dashboard';
import axios from 'axios';
import React from 'react';

// Mock axios
vi.mock('axios');

// Mock Recharts to avoid rendering issues in JSDOM
vi.mock('recharts', () => {
    const OriginalModule = vi.importActual('recharts');
    return {
        ...OriginalModule,
        ResponsiveContainer: ({ children }) => <div className="recharts-responsive-container">{children}</div>,
        BarChart: () => <div data-testid="bar-chart">BarChart</div>,
        Bar: () => null,
        XAxis: () => null,
        YAxis: () => null,
        CartesianGrid: () => null,
        Tooltip: () => null,
        Cell: () => null,
    };
});

describe('Dashboard Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders loading state initially', () => {
        // Mock pending promise to keep it loading
        axios.get.mockImplementation(() => new Promise(() => { }));
        render(<Dashboard />);
        // Check for spinner or loading container
        const spinner = document.querySelector('.animate-spin');
        expect(spinner).toBeInTheDocument();
    });

    it('renders metrics and charts after data fetch', async () => {
        axios.get.mockImplementation((url) => {
            if (url === '/api/metrics') return Promise.resolve({ data: { totalArticles: 100, avgSentiment: 0.5, activeSources: 10 } });
            if (url === '/api/articles') return Promise.resolve({ data: [{ title: 'Test Article', publisher: 'Test Pub', published_at: '2023-01-01' }] });
            if (url === '/api/categories') return Promise.resolve({ data: [{ category: 'Tech', count: 50 }] });
            return Promise.reject(new Error('not found'));
        });

        render(<Dashboard />);

        await waitFor(() => {
            expect(screen.getByText('MISSION CONTROL')).toBeInTheDocument();
        });

        expect(screen.getByText('TOTAL INTEL')).toBeInTheDocument();
        expect(screen.getByText('100')).toBeInTheDocument();
        expect(screen.getByText('Test Article')).toBeInTheDocument();
        expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });
});
