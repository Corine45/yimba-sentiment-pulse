
interface EngagementSummaryProps {
  totalPosts: number;
  totalEngagement: {
    likes: number;
    comments: number;
    shares: number;
  };
}

export const EngagementSummary = ({ totalPosts, totalEngagement }: EngagementSummaryProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="text-center p-4 bg-blue-50 rounded-lg">
        <div className="text-2xl font-bold text-blue-600">{totalPosts}</div>
        <div className="text-sm text-blue-800">Posts analysés</div>
      </div>
      <div className="text-center p-4 bg-red-50 rounded-lg">
        <div className="text-2xl font-bold text-red-600">{totalEngagement.likes.toLocaleString()}</div>
        <div className="text-sm text-red-800">J'aime total</div>
      </div>
      <div className="text-center p-4 bg-green-50 rounded-lg">
        <div className="text-2xl font-bold text-green-600">{totalEngagement.comments.toLocaleString()}</div>
        <div className="text-sm text-green-800">Commentaires total</div>
      </div>
      <div className="text-center p-4 bg-purple-50 rounded-lg">
        <div className="text-2xl font-bold text-purple-600">{totalEngagement.shares.toLocaleString()}</div>
        <div className="text-sm text-purple-800">Partages total</div>
      </div>
    </div>
  );
};
