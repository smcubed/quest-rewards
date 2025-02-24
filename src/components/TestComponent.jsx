import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const TestComponent = () => {
  return (
    <div className="p-4 max-w-md mx-auto">
      <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader>
          <CardTitle>Test Card</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">If you can see this card with proper styling, Tailwind is working!</p>
          
          {/* Test grid */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-blue-500 text-white p-4 rounded">Grid Item 1</div>
            <div className="bg-green-500 text-white p-4 rounded">Grid Item 2</div>
          </div>
          
          {/* Test button */}
          <button className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
            Test Button
          </button>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestComponent;