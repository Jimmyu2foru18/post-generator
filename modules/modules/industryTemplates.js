// Industry-specific template expansions
export const industryTemplates = {
    technology: {
        subcategories: {
            software: ['web', 'mobile', 'cloud', 'AI', 'ML', 'DevOps', 'security'],
            hardware: ['IoT', 'robotics', 'processors', 'networking', '5G'],
            data: ['analytics', 'big data', 'visualization', 'mining', 'warehousing'],
            enterprise: ['ERP', 'CRM', 'SCM', 'BPM', 'collaboration'],
            emerging: ['blockchain', 'AR/VR', 'quantum', 'edge computing']
        },
        templates: {
            technical: [
                `${topic} optimizes ${metric} through ${approach}`,
                `Advanced ${topic} implementation enables ${benefit}`,
                `${topic} architecture streamlines ${process}`,
                `Innovative ${topic} solution transforms ${industry} sector`,
                `${topic} integration enhances ${metric} by ${percentage}%`
            ],
            business: [
                `${topic} delivers ${percentage}% improvement in ${metric}`,
                `Enterprise adoption of ${topic} grows by ${percentage}%`,
                `${topic} implementation reduces ${cost} by ${percentage}%`,
                `ROI of ${topic} exceeds ${percentage}% in ${timeframe}`,
                `${topic} drives ${metric} optimization across ${industry}`
            ]
        }
    },
    healthcare: {
        subcategories: {
            clinical: ['diagnostics', 'treatment', 'patient care', 'telemedicine', 'EMR'],
            research: ['clinical trials', 'drug development', 'genomics', 'biotech'],
            operations: ['hospital management', 'scheduling', 'billing', 'compliance'],
            wellness: ['preventive care', 'mental health', 'rehabilitation', 'nutrition'],
            technology: ['medical devices', 'health IT', 'imaging', 'monitoring']
        },
        templates: {
            technical: [
                `${topic} enhances patient outcomes through ${approach}`,
                `Advanced ${topic} protocol improves ${metric}`,
                `${topic} system optimizes ${process} workflow`,
                `Innovative ${topic} solution reduces ${metric}`,
                `${topic} integration streamlines ${process}`
            ],
            business: [
                `${topic} reduces care costs by ${percentage}%`,
                `Implementation of ${topic} improves patient satisfaction by ${percentage}%`,
                `${topic} adoption increases efficiency by ${percentage}%`,
                `Healthcare providers report ${percentage}% ${metric} improvement`,
                `${topic} delivers ROI of ${percentage}% within ${timeframe}`
            ]
        }
    },
    finance: {
        subcategories: {
            banking: ['retail', 'commercial', 'investment', 'digital banking'],
            investment: ['asset management', 'trading', 'wealth management', 'advisory'],
            insurance: ['life', 'property', 'health', 'risk management'],
            fintech: ['payments', 'blockchain', 'lending', 'regtech'],
            compliance: ['risk', 'regulatory', 'audit', 'reporting']
        },
        templates: {
            technical: [
                `${topic} platform processes ${metric} in real-time`,
                `Advanced ${topic} algorithm optimizes ${process}`,
                `${topic} system ensures compliance with ${regulation}`,
                `${topic} solution automates ${process}`,
                `Integrated ${topic} framework enhances ${metric}`
            ],
            business: [
                `${topic} reduces operational costs by ${percentage}%`,
                `${topic} implementation increases ${metric} by ${percentage}%`,
                `ROI of ${topic} solution reaches ${percentage}%`,
                `${topic} adoption drives ${percentage}% efficiency gain`,
                `${topic} delivers ${metric} improvement within ${timeframe}`
            ]
        }
    },
    manufacturing: {
        subcategories: {
            production: ['automation', 'assembly', 'quality control', 'scheduling'],
            supply_chain: ['logistics', 'inventory', 'procurement', 'distribution'],
            maintenance: ['predictive', 'preventive', 'equipment', 'facilities'],
            quality: ['inspection', 'testing', 'compliance', 'certification'],
            innovation: ['R&D', 'product development', 'process improvement']
        },
        templates: {
            technical: [
                `${topic} optimizes production ${metric} through ${approach}`,
                `Advanced ${topic} system reduces ${waste} by ${percentage}%`,
                `${topic} automation improves ${process} efficiency`,
                `${topic} integration enhances quality control`,
                `Smart ${topic} solution streamlines ${process}`
            ],
            business: [
                `${topic} increases productivity by ${percentage}%`,
                `Implementation of ${topic} reduces costs by ${percentage}%`,
                `${topic} adoption improves ${metric} by ${percentage}%`,
                `ROI of ${topic} system exceeds ${percentage}%`,
                `${topic} delivers operational excellence in ${timeframe}`
            ]
        }
    },
    retail: {
        subcategories: {
            ecommerce: ['online shopping', 'marketplace', 'mobile commerce'],
            operations: ['inventory', 'supply chain', 'fulfillment', 'POS'],
            marketing: ['personalization', 'loyalty', 'analytics', 'promotion'],
            customer: ['experience', 'service', 'engagement', 'support'],
            digital: ['omnichannel', 'payments', 'mobile apps', 'social commerce']
        },
        templates: {
            technical: [
                `${topic} platform enhances customer experience`,
                `${topic} solution optimizes ${process} efficiency`,
                `Advanced ${topic} system streamlines ${operation}`,
                `${topic} integration enables real-time ${metric}`,
                `${topic} technology transforms ${process}`
            ],
            business: [
                `${topic} increases sales by ${percentage}%`,
                `${topic} implementation improves ${metric} by ${percentage}%`,
                `ROI of ${topic} reaches ${percentage}% in ${timeframe}`,
                `${topic} adoption drives customer satisfaction up ${percentage}%`,
                `${topic} delivers ${metric} growth across channels`
            ]
        }
    },
    energy: {
        subcategories: {
            renewable: ['solar', 'wind', 'hydro', 'geothermal', 'biomass'],
            traditional: ['oil', 'gas', 'coal', 'nuclear', 'grid'],
            efficiency: ['smart grid', 'storage', 'distribution', 'monitoring'],
            sustainability: ['carbon reduction', 'emissions', 'green tech'],
            infrastructure: ['transmission', 'distribution', 'maintenance']
        },
        templates: {
            technical: [
                `${topic} optimizes energy ${metric} by ${percentage}%`,
                `Advanced ${topic} system maximizes resource utilization`,
                `${topic} technology reduces carbon footprint by ${percentage}%`,
                `Smart ${topic} solution enables grid optimization`,
                `${topic} integration improves distribution efficiency`
            ],
            business: [
                `${topic} reduces operational costs by ${percentage}%`,
                `Implementation of ${topic} yields ${percentage}% energy savings`,
                `${topic} adoption drives sustainability metrics up ${percentage}%`,
                `ROI from ${topic} deployment exceeds ${percentage}%`,
                `${topic} enhances grid reliability by ${percentage}%`
            ]
        }
    },
    education: {
        subcategories: {
            delivery: ['online learning', 'hybrid', 'classroom', 'mobile learning'],
            content: ['curriculum', 'assessment', 'multimedia', 'interactive'],
            management: ['LMS', 'analytics', 'administration', 'scheduling'],
            support: ['tutoring', 'accessibility', 'student services'],
            innovation: ['AR/VR learning', 'gamification', 'adaptive learning']
        },
        templates: {
            technical: [
                `${topic} enhances learning outcomes through ${approach}`,
                `Advanced ${topic} platform personalizes education delivery`,
                `${topic} system enables adaptive learning paths`,
                `${topic} solution transforms educational ${process}`,
                `Innovative ${topic} improves student engagement`
            ],
            business: [
                `${topic} increases student success rates by ${percentage}%`,
                `${topic} implementation reduces dropout rates by ${percentage}%`,
                `Educational institutions report ${percentage}% ${metric} improvement`,
                `${topic} adoption enhances learning efficiency by ${percentage}%`,
                `ROI of ${topic} in education reaches ${percentage}%`
            ]
        }
    },
    agriculture: {
        subcategories: {
            farming: ['precision agriculture', 'crop management', 'irrigation', 'harvesting'],
            livestock: ['breeding', 'health monitoring', 'feed management', 'tracking'],
            technology: ['drones', 'IoT sensors', 'automation', 'data analytics'],
            sustainability: ['organic farming', 'conservation', 'water management'],
            operations: ['supply chain', 'storage', 'processing', 'distribution']
        },
        templates: {
            technical: [
                `${topic} optimizes crop yield through ${approach}`,
                `Smart ${topic} system enhances resource utilization`,
                `${topic} technology enables precision farming`,
                `Advanced ${topic} solution improves soil management`,
                `${topic} integration automates ${process}`
            ],
            business: [
                `${topic} increases agricultural productivity by ${percentage}%`,
                `Implementation of ${topic} reduces resource waste by ${percentage}%`,
                `${topic} adoption improves farm efficiency by ${percentage}%`,
                `ROI from ${topic} reaches ${percentage}% within ${timeframe}`,
                `${topic} enhances sustainable practices by ${percentage}%`
            ]
        }
    },
    transportation: {
        subcategories: {
            logistics: ['fleet management', 'routing', 'tracking', 'scheduling'],
            vehicles: ['electric', 'autonomous', 'connected', 'maintenance'],
            infrastructure: ['smart roads', 'charging stations', 'traffic management'],
            services: ['ride-sharing', 'delivery', 'public transit', 'mobility'],
            safety: ['monitoring', 'compliance', 'emergency response', 'training']
        },
        templates: {
            technical: [
                `${topic} optimizes route efficiency through ${approach}`,
                `Advanced ${topic} system enables real-time tracking`,
                `${topic} platform enhances fleet management`,
                `Smart ${topic} solution improves safety metrics`,
                `${topic} integration streamlines logistics operations`
            ],
            business: [
                `${topic} reduces fuel consumption by ${percentage}%`,
                `Implementation of ${topic} improves delivery times by ${percentage}%`,
                `${topic} adoption increases fleet efficiency by ${percentage}%`,
                `ROI of ${topic} exceeds ${percentage}% annually`,
                `${topic} enhances customer satisfaction by ${percentage}%`
            ]
        }
    },
    construction: {
        subcategories: {
            planning: ['design', 'BIM', 'estimation', 'scheduling'],
            execution: ['project management', 'safety', 'quality control'],
            equipment: ['machinery', 'tools', 'maintenance', 'automation'],
            materials: ['procurement', 'inventory', 'sustainability'],
            technology: ['drones', '3D printing', 'IoT', 'AR/VR']
        },
        templates: {
            technical: [
                `${topic} optimizes construction workflow through ${approach}`,
                `Advanced ${topic} system enables real-time monitoring`,
                `${topic} solution improves project coordination`,
                `Smart ${topic} platform enhances safety compliance`,
                `${topic} integration streamlines resource allocation`
            ],
            business: [
                `${topic} reduces project delays by ${percentage}%`,
                `Implementation of ${topic} cuts costs by ${percentage}%`,
                `${topic} adoption improves worker productivity by ${percentage}%`,
                `ROI from ${topic} reaches ${percentage}% per project`,
                `${topic} enhances project delivery by ${percentage}%`
            ]
        }
    }
}; 