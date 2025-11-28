import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Home, DollarSign, Grid3x3, List, ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  address: string;
  city: string;
  state: string;
  property_type: string;
  status: string;
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  property_media: Array<{ media_url: string }>;
}

const PropertiesListPublic = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState(searchParams.get('location') || '');
  const [propertyType, setPropertyType] = useState(searchParams.get('type') || '');
  const [priceRange, setPriceRange] = useState(searchParams.get('price') || '');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 12;

  useEffect(() => {
    fetchProperties();
  }, [searchTerm, propertyType, priceRange, currentPage]);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('properties')
        .select('*, property_media(media_url)', { count: 'exact' })
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1);

      if (searchTerm) {
        query = query.or(`city.ilike.%${searchTerm}%,state.ilike.%${searchTerm}%,address.ilike.%${searchTerm}%`);
      }

      if (propertyType && propertyType !== 'all') {
        query = query.eq('property_type', propertyType);
      }

      if (priceRange && priceRange !== 'all') {
        const [min, max] = priceRange.split('-').map(p => p.replace('+', ''));
        if (max) {
          query = query.gte('price', parseInt(min)).lte('price', parseInt(max));
        } else {
          query = query.gte('price', parseInt(min));
        }
      }

      const { data, error, count } = await query;

      if (error) throw error;
      
      setProperties(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 mt-20">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Available Properties</h1>
          <p className="text-muted-foreground">Discover your perfect luxury property</p>
        </div>

        {/* Filters */}
        <div className="glass-effect rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 px-4 py-3 bg-muted/50 rounded-xl">
              <Search className="w-5 h-5 text-primary" />
              <Input
                placeholder="Search location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>

            <div className="flex items-center gap-3">
              <Home className="w-5 h-5 text-primary ml-3" />
              <Select value={propertyType} onValueChange={setPropertyType}>
                <SelectTrigger className="border-none bg-muted/50 text-foreground focus:ring-primary focus:ring-offset-0 h-[50px] hover:bg-muted/70 transition-smooth">
                  <SelectValue placeholder="Property Type" />
                </SelectTrigger>
                <SelectContent className="bg-background border-border z-50">
                  <SelectItem value="all" className="hover:bg-primary/10 focus:bg-primary/10">All Types</SelectItem>
                  <SelectItem value="apartment" className="hover:bg-primary/10 focus:bg-primary/10">Apartment</SelectItem>
                  <SelectItem value="house" className="hover:bg-primary/10 focus:bg-primary/10">House</SelectItem>
                  <SelectItem value="villa" className="hover:bg-primary/10 focus:bg-primary/10">Villa</SelectItem>
                  <SelectItem value="commercial" className="hover:bg-primary/10 focus:bg-primary/10">Commercial</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-3">
              <DollarSign className="w-5 h-5 text-primary ml-3" />
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="border-none bg-muted/50 text-foreground focus:ring-primary focus:ring-offset-0 h-[50px] hover:bg-muted/70 transition-smooth">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent className="bg-background border-border z-50">
                  <SelectItem value="all" className="hover:bg-primary/10 focus:bg-primary/10">All Prices</SelectItem>
                  <SelectItem value="0-500000" className="hover:bg-primary/10 focus:bg-primary/10">$0 - $500K</SelectItem>
                  <SelectItem value="500000-1000000" className="hover:bg-primary/10 focus:bg-primary/10">$500K - $1M</SelectItem>
                  <SelectItem value="1000000-2000000" className="hover:bg-primary/10 focus:bg-primary/10">$1M - $2M</SelectItem>
                  <SelectItem value="2000000-5000000" className="hover:bg-primary/10 focus:bg-primary/10">$2M - $5M</SelectItem>
                  <SelectItem value="5000000+" className="hover:bg-primary/10 focus:bg-primary/10">$5M+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
                className="h-[50px]"
              >
                <Grid3x3 className="w-5 h-5" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
                className="h-[50px]"
              >
                <List className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Found <span className="text-primary font-semibold">{totalCount}</span> properties
          </p>
        </div>

        {/* Properties Grid/List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden animate-pulse">
                <div className="h-64 bg-muted" />
                <CardContent className="p-6">
                  <div className="h-4 bg-muted rounded mb-2" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-16">
            <Home className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-foreground mb-2">No properties found</h3>
            <p className="text-muted-foreground">Try adjusting your filters</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {properties.map((property) => (
              <Link key={property.id} to={`/properties/${property.id}`} className="block">
                <Card className="overflow-hidden hover:shadow-elegant transition-smooth group">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={property.property_media[0]?.media_url || '/placeholder.svg'}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-primary text-primary-foreground">
                        {property.status}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-smooth">
                      {property.title}
                    </h3>
                    <div className="flex items-center gap-2 text-muted-foreground mb-4">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{property.city}, {property.state}</span>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-primary">
                        {formatPrice(property.price)}
                      </span>
                      <Badge variant="outline" className="capitalize">
                        {property.property_type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{property.bedrooms} beds</span>
                      <span>•</span>
                      <span>{property.bathrooms} baths</span>
                      <span>•</span>
                      <span>{property.square_feet} sqft</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = currentPage <= 3 ? i + 1 : currentPage + i - 2;
                if (page > totalPages) return null;
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'default' : 'outline'}
                    onClick={() => setCurrentPage(page)}
                    className="w-10"
                  >
                    {page}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default PropertiesListPublic;