/**
 * BundleComparison component
 *
 * Compares bundle size before and after localization
 * to demonstrate minimal overhead introduced by Lingo.dev.
 *
 * @returns {JSX.Element} Bundle size comparison visualization
 */


import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Package, TrendingDown } from 'lucide-react';

export default function BundleComparison() {
  const data = [
    {
      name: 'react-i18next',
      bundle: 145,
      dictionaries: 89,
      total: 234
    },
    {
      name: 'react-intl',
      bundle: 132,
      dictionaries: 89,
      total: 221
    },
    {
      name: 'Lingo.dev',
      bundle: 8,
      dictionaries: 89,
      total: 97
    }
  ];

  return (
    <div>
      <h2 style={{ fontSize: 32, marginBottom: 24 }}>Bundle Size Comparison</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: 40 }}>
        <StatCard
          icon={Package}
          title="Traditional i18n"
          value="234 KB"
          description="Runtime library + translation files"
          color="#ef4444"
        />
        <StatCard
          icon={Package}
          title="Lingo.dev Compiler"
          value="97 KB"
          description="No runtime overhead"
          color="#10b981"
        />
        <StatCard
          icon={TrendingDown}
          title="Size Reduction"
          value="58.5%"
          description="Smaller bundles, faster loads"
          color="#667eea"
        />
      </div>

      <div style={{
        background: '#1e293b',
        borderRadius: 12,
        padding: 24,
        border: '1px solid #334155'
      }}>
        <h3 style={{ fontSize: 20, marginBottom: 24 }}>Bundle Size Breakdown (KB)</h3>
        
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{
                background: '#0f172a',
                border: '1px solid #334155',
                borderRadius: 8
              }}
            />
            <Legend />
            <Bar dataKey="bundle" fill="#667eea" name="Runtime Library" />
            <Bar dataKey="dictionaries" fill="#764ba2" name="Translations" />
          </BarChart>
        </ResponsiveContainer>

        <div style={{
          marginTop: 24,
          padding: 16,
          background: '#0f172a',
          borderRadius: 8,
          borderLeft: '4px solid #10b981'
        }}>
          <p style={{ margin: 0, fontSize: 14 }}>
            <strong>Why is Lingo.dev smaller?</strong> Traditional libraries ship runtime translation logic 
            (parsing, formatting, pluralization). Lingo.dev does all this at build time, so your users 
            only download the final translated strings.
          </p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, title, value, description, color }) {
  return (
    <div style={{
      background: '#1e293b',
      borderRadius: 12,
      padding: 24,
      border: '1px solid #334155'
    }}>
      <div style={{
        width: 48,
        height: 48,
        borderRadius: 12,
        background: `${color}20`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16
      }}>
        <Icon size={24} color={color} />
      </div>
      <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: 32, fontWeight: 700, color, marginBottom: 8 }}>{value}</div>
      <div style={{ fontSize: 14, opacity: 0.8 }}>{description}</div>
    </div>
  );
}