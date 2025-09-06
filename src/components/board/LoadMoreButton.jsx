import React, { memo, useCallback } from "react";

const LoadMoreButton = memo(({ onLoadMore, loading, columnId }) => {
    const handleClick = useCallback(() => {
        onLoadMore(columnId);
    }, [onLoadMore, columnId]);

    return (
        <div className="load-more-container">
            <button 
                className="load-more-btn"
                onClick={handleClick}
                disabled={loading}
            >
                {loading ? (
                    <>
                        <span className="spinner">⟳</span>
                        Loading...
                    </>
                ) : (
                    "Load more"
                )}
            </button>
        </div>
    );
});

export default LoadMoreButton;
