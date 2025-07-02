import React from 'react';
import Input from '@/components/atoms/Input';

const SearchBar = ({ value, onChange, placeholder = "Search...", className = '' }) => {
  return (
    <div className={className}>
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        icon="Search"
        iconPosition="left"
        className="bg-white"
      />
    </div>
  );
};

export default SearchBar;