import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import Analytics from '../pages/Analytics';
import axios from 'axios';
import React from 'react';

vi.mock('axios');
vi.mock('recharts', () => ({
    ResponsiveContainer: ({ children }) => <div>{children}</div>,
    LineChart: () => <div data-testid="line-chart">LineChart</div>,
    Line: () => null,
    XAxis: () => null,
    YAxis: () => null,
    CartesianGrid: () => null,
    Tooltip: () => null,
    PieChart: () => <div data-testid="pie-chart">PieChart</div>,
    Pie: () => null,
    Cell: () => null,
}));

describe('Analytics Component', () => {
    it('renders analytics charts', async () => {
        axios.get.mockResolvedValue({ data: [{ category: 'Tech', count: 10 }] });

        render(<Analytics />);

        await waitFor(() => {
            expect(screen.getByText('DEEP ANALYTICS')).toBeInTheDocument();
        });

        expect(screen.getByText('SENTIMENT TIMELINE (24H)')).toBeInTheDocument();
        expect(screen.getByTestId('line-chart')).toBeInTheDocument();
        expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    });
});
