import React, { useState } from "react";
import { cn } from "../lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Input,
  Label,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Avatar,
  AvatarImage,
  AvatarFallback,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/basic-ui";
import {
  Star,
  ThumbsUp,
  ThumbsDown,
  Shield,
  TrendingUp,
  MessageSquare,
  Filter,
  Search,
  Calendar,
  Award,
  CheckCircle,
  AlertTriangle,
  User,
  BarChart3,
} from "lucide-react";

const RatingsReviews = () => {
  const [activeTab, setActiveTab] = useState("reviews"); // 'reviews', 'sellers', 'write'
  const [filterRating, setFilterRating] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock reviews data
  const reviews = [
    {
      id: 1,
      reviewer: "Alice Johnson",
      reviewerAvatar: null,
      rating: 5,
      date: "2024-01-20",
      verified: true,
      asset: "Brazilian Forest Credits",
      seller: "Amazon Conservation Fund",
      title: "Excellent quality and transparency",
      content:
        "Outstanding experience with these forest credits. The documentation was comprehensive, and I could track the exact location of my investment. The seller was responsive and provided regular updates on the conservation project.",
      helpful: 12,
      notHelpful: 1,
      sellerResponse: {
        content:
          "Thank you for your positive feedback! We're committed to transparency and will continue providing detailed updates on all our conservation projects.",
        date: "2024-01-21",
      },
    },
    {
      id: 2,
      reviewer: "Mark Thompson",
      reviewerAvatar: null,
      rating: 4,
      date: "2024-01-18",
      verified: true,
      asset: "Solar Energy Credits",
      seller: "SunPower Corp",
      title: "Good credits but delivery was slow",
      content:
        "The solar energy credits were well-documented and legitimate. However, the delivery process took longer than expected - about 5 days instead of the promised 2-3 days. Overall satisfied with the quality.",
      helpful: 8,
      notHelpful: 2,
      sellerResponse: null,
    },
    {
      id: 3,
      reviewer: "Sarah Kim",
      reviewerAvatar: null,
      rating: 5,
      date: "2024-01-15",
      verified: true,
      asset: "Wind Energy Credits",
      seller: "WindPower Ltd",
      title: "Perfect for corporate offsetting",
      content:
        "Purchased these for our company's carbon neutrality goal. The credits came with detailed certification and the offshore wind farm data was impressive. Highly recommend for business customers.",
      helpful: 15,
      notHelpful: 0,
      sellerResponse: {
        content:
          "We appreciate your business and are glad our corporate packages met your expectations. Thank you for choosing renewable energy!",
        date: "2024-01-16",
      },
    },
    {
      id: 4,
      reviewer: "David Rodriguez",
      reviewerAvatar: null,
      rating: 3,
      date: "2024-01-12",
      verified: false,
      asset: "Industrial Efficiency Credits",
      seller: "EcoManufacturing GmbH",
      title: "Average experience",
      content:
        "The credits were legitimate but the customer service could be better. Had some questions about the verification process that took a while to get answered.",
      helpful: 5,
      notHelpful: 3,
      sellerResponse: {
        content:
          "We apologize for the delayed response. We've since improved our customer service team and response times. Please reach out if you need any further assistance.",
        date: "2024-01-14",
      },
    },
  ];

  // Mock top sellers data
  const topSellers = [
    {
      id: 1,
      name: "Amazon Conservation Fund",
      avatar: null,
      rating: 4.9,
      totalReviews: 234,
      totalSales: 15420,
      verificationLevel: "Gold",
      specialties: ["Forest Conservation", "Biodiversity"],
      joinDate: "2022-03-15",
      responseRate: 98,
      responseTime: "< 2 hours",
    },
    {
      id: 2,
      name: "SunPower Corp",
      avatar: null,
      rating: 4.7,
      totalReviews: 189,
      totalSales: 12890,
      verificationLevel: "Gold",
      specialties: ["Solar Energy", "Renewable"],
      joinDate: "2021-11-08",
      responseRate: 95,
      responseTime: "< 4 hours",
    },
    {
      id: 3,
      name: "WindPower Ltd",
      avatar: null,
      rating: 4.6,
      totalReviews: 156,
      totalSales: 9870,
      verificationLevel: "Silver",
      specialties: ["Wind Energy", "Offshore"],
      joinDate: "2022-07-22",
      responseRate: 92,
      responseTime: "< 6 hours",
    },
  ];

  // Filter and sort reviews
  const filteredReviews = reviews
    .filter((review) => {
      const matchesRating =
        filterRating === "all" || review.rating.toString() === filterRating;
      const matchesSearch =
        review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.seller.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesRating && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "recent") return new Date(b.date) - new Date(a.date);
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "helpful") return b.helpful - a.helpful;
      return 0;
    });

  const averageRating =
    reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((r) => r.rating === rating).length,
    percentage:
      (reviews.filter((r) => r.rating === rating).length / reviews.length) *
      100,
  }));

  const renderStars = (rating, size = "sm") => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          size === "sm" ? "h-4 w-4" : "h-5 w-5",
          i < rating
            ? "text-yellow-400 fill-current"
            : "text-gray-300 fill-current",
        )}
      />
    ));
  };

  const ReviewsTab = () => (
    <div className="space-y-6">
      {/* Reviews Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Overall Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-4">
              <div className="text-4xl font-bold mb-2">
                {averageRating.toFixed(1)}
              </div>
              <div className="flex justify-center mb-2">
                {renderStars(Math.round(averageRating), "lg")}
              </div>
              <p className="text-gray-600">{reviews.length} reviews</p>
            </div>

            <div className="space-y-2">
              {ratingDistribution.map((dist) => (
                <div key={dist.rating} className="flex items-center space-x-2">
                  <span className="text-sm w-8">{dist.rating}</span>
                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{ width: `${dist.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-8">
                    {dist.count}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Filters & Search</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search reviews..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterRating} onValueChange={setFilterRating}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Ratings" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="rating">Highest Rating</SelectItem>
                  <SelectItem value="helpful">Most Helpful</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={review.reviewerAvatar} />
                    <AvatarFallback>
                      {review.reviewer
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{review.reviewer}</span>
                      {review.verified && (
                        <Badge variant="secondary" className="text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified Purchase
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex">{renderStars(review.rating)}</div>
                      <span className="text-sm text-gray-500">
                        {review.date}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold mb-2">{review.title}</h4>
                <p className="text-gray-700 mb-2">{review.content}</p>
                <div className="text-sm text-gray-500">
                  <span className="font-medium">Asset:</span> {review.asset} •{" "}
                  <span className="font-medium">Seller:</span> {review.seller}
                </div>
              </div>

              <div className="flex items-center justify-between border-t pt-4">
                <div className="flex items-center space-x-4">
                  <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-green-600">
                    <ThumbsUp className="h-4 w-4" />
                    <span>Helpful ({review.helpful})</span>
                  </button>
                  <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-red-600">
                    <ThumbsDown className="h-4 w-4" />
                    <span>Not Helpful ({review.notHelpful})</span>
                  </button>
                </div>
                <Button variant="ghost" size="sm">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Reply
                </Button>
              </div>

              {/* Seller Response */}
              {review.sellerResponse && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="secondary">Seller Response</Badge>
                    <span className="text-sm text-gray-500">
                      {review.sellerResponse.date}
                    </span>
                  </div>
                  <p className="text-gray-700">
                    {review.sellerResponse.content}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const SellersTab = () => (
    <div className="space-y-6">
      {/* Top Sellers Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="h-5 w-5 text-yellow-500" />
            <span>Top Rated Sellers</span>
          </CardTitle>
          <p className="text-gray-600">
            Discover the most trusted and highly-rated carbon credit sellers on
            our platform
          </p>
        </CardHeader>
      </Card>

      {/* Seller Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {topSellers.map((seller) => (
          <Card key={seller.id}>
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={seller.avatar} />
                  <AvatarFallback className="text-lg">
                    {seller.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold">{seller.name}</h3>
                    <Badge
                      variant={
                        seller.verificationLevel === "Gold"
                          ? "default"
                          : "secondary"
                      }
                      className={cn(
                        seller.verificationLevel === "Gold"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-700",
                      )}
                    >
                      <Shield className="h-3 w-3 mr-1" />
                      {seller.verificationLevel} Verified
                    </Badge>
                  </div>

                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center space-x-1">
                      <div className="flex">{renderStars(seller.rating)}</div>
                      <span className="font-semibold">{seller.rating}</span>
                      <span className="text-gray-500">
                        ({seller.totalReviews} reviews)
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Total Sales</p>
                      <p className="font-semibold">
                        {seller.totalSales.toLocaleString()} credits
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Member Since</p>
                      <p className="font-semibold">{seller.joinDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Response Rate</p>
                      <p className="font-semibold">{seller.responseRate}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Response Time</p>
                      <p className="font-semibold">{seller.responseTime}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Specialties</p>
                    <div className="flex flex-wrap gap-2">
                      {seller.specialties.map((specialty, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button size="sm" className="flex-1">
                      View Listings
                    </Button>
                    <Button variant="outline" size="sm">
                      Contact
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-green-600" />
            <span>Marketplace Statistics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">4.8</div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">96%</div>
              <div className="text-sm text-gray-600">Verified Sellers</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">1,247</div>
              <div className="text-sm text-gray-600">Total Reviews</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">2.3h</div>
              <div className="text-sm text-gray-600">Avg Response Time</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const WriteReviewTab = () => (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5 text-green-600" />
            <span>Write a Review</span>
          </CardTitle>
          <p className="text-gray-600">
            Share your experience to help other buyers make informed decisions
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="purchase-select">Select Purchase</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Choose a recent purchase" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="forest-1">
                  Brazilian Forest Credits - Amazon Conservation Fund
                </SelectItem>
                <SelectItem value="solar-1">
                  Solar Energy Credits - SunPower Corp
                </SelectItem>
                <SelectItem value="wind-1">
                  Wind Energy Credits - WindPower Ltd
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Overall Rating</Label>
            <div className="flex space-x-2 mt-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <Star
                  key={rating}
                  className="h-8 w-8 text-gray-300 cursor-pointer hover:text-yellow-400 transition-colors"
                />
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="review-title">Review Title</Label>
            <Input
              id="review-title"
              placeholder="Summarize your experience"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="review-content">Detailed Review</Label>
            <Textarea
              id="review-content"
              placeholder="Tell others about your experience with this seller and their carbon credits..."
              rows={6}
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Credit Quality</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Rate quality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">Excellent</SelectItem>
                  <SelectItem value="4">Good</SelectItem>
                  <SelectItem value="3">Average</SelectItem>
                  <SelectItem value="2">Below Average</SelectItem>
                  <SelectItem value="1">Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Delivery Speed</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Rate delivery" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">Very Fast</SelectItem>
                  <SelectItem value="4">Fast</SelectItem>
                  <SelectItem value="3">Average</SelectItem>
                  <SelectItem value="2">Slow</SelectItem>
                  <SelectItem value="1">Very Slow</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Communication</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Rate communication" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">Excellent</SelectItem>
                  <SelectItem value="4">Good</SelectItem>
                  <SelectItem value="3">Average</SelectItem>
                  <SelectItem value="2">Below Average</SelectItem>
                  <SelectItem value="1">Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium">Review Guidelines</p>
                <ul className="mt-1 space-y-1 list-disc list-inside">
                  <li>Be honest and fair in your assessment</li>
                  <li>Focus on your actual experience with the seller</li>
                  <li>Avoid personal attacks or inappropriate language</li>
                  <li>Include specific details to help other buyers</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button className="flex-1">Submit Review</Button>
            <Button variant="outline">Save as Draft</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        <button
          className={cn(
            "flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors",
            activeTab === "reviews"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900",
          )}
          onClick={() => setActiveTab("reviews")}
        >
          Reviews ({reviews.length})
        </button>
        <button
          className={cn(
            "flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors",
            activeTab === "sellers"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900",
          )}
          onClick={() => setActiveTab("sellers")}
        >
          Top Sellers
        </button>
        <button
          className={cn(
            "flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors",
            activeTab === "write"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900",
          )}
          onClick={() => setActiveTab("write")}
        >
          Write Review
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "reviews" && <ReviewsTab />}
      {activeTab === "sellers" && <SellersTab />}
      {activeTab === "write" && <WriteReviewTab />}
    </div>
  );
};

export default RatingsReviews;
