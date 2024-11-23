export const Loading = ({ size = 'default' }) => {
    const sizeClasses = {
      small: 'h-4 w-4',
      default: 'h-8 w-8',
      large: 'h-12 w-12'
    };
  
    return (
      <div className="flex justify-center items-center">
        <div
          className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-primary-200 border-t-primary-600`}
        />
      </div>
    );
  };