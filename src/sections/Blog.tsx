import { useEffect, useRef, useCallback, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, ChevronUp, Clock, Calendar } from 'lucide-react';
import { blogConfig, type BlogPost } from '../config';

gsap.registerPlugin(ScrollTrigger);

export function Blog() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const postsRef = useRef<(HTMLDivElement | null)[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const triggersRef = useRef<ScrollTrigger[]>([]);

  const [posts, setPosts] = useState<BlogPost[]>(blogConfig.posts);
  const [loading, setLoading] = useState(true);
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);
  const expandedRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const getPostKey = (post: BlogPost) => post.slug || String(post.id);

  const togglePost = useCallback((post: BlogPost) => {
    const key = getPostKey(post);
    if (expandedSlug === key) {
      // Collapse
      const el = expandedRefs.current[key];
      if (el) {
        gsap.to(el, {
          height: 0,
          opacity: 0,
          duration: 0.4,
          ease: 'power2.inOut',
          onComplete: () => setExpandedSlug(null),
        });
      } else {
        setExpandedSlug(null);
      }
    } else {
      // Collapse previous if open
      if (expandedSlug) {
        const prevEl = expandedRefs.current[expandedSlug];
        if (prevEl) {
          gsap.to(prevEl, { height: 0, opacity: 0, duration: 0.3, ease: 'power2.in' });
        }
      }
      setExpandedSlug(key);
    }
  }, [expandedSlug]);

  // Animate expanded section open after render
  useEffect(() => {
    if (!expandedSlug) return;
    const el = expandedRefs.current[expandedSlug];
    if (!el) return;

    // Measure natural height
    el.style.height = 'auto';
    const naturalHeight = el.offsetHeight;
    el.style.height = '0px';

    gsap.to(el, {
      height: naturalHeight,
      opacity: 1,
      duration: 0.5,
      ease: 'power2.out',
      onComplete: () => {
        el.style.height = 'auto'; // allow content reflow
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      },
    });
  }, [expandedSlug]);

  // Fetch posts from Netlify function, fall back to config
  useEffect(() => {
    fetch('/.netlify/functions/blog-posts')
      .then((res) => {
        if (!res.ok) throw new Error('fetch failed');
        return res.json();
      })
      .then((data: BlogPost[]) => {
        if (data.length > 0) setPosts(data);
      })
      .catch(() => {
        // Keep blogConfig.posts as fallback — already set as default
      })
      .finally(() => setLoading(false));
  }, []);

  // GSAP animations — re-run when posts change
  useEffect(() => {
    if (loading) return;
    if (!blogConfig.title || posts.length === 0) return;
    const section = sectionRef.current;
    if (!section) return;

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top 80%',
      onEnter: () => {
        const tl = gsap.timeline();

        // Title typewriter effect
        if (titleRef.current) {
          const text = titleRef.current.textContent || '';
          titleRef.current.textContent = '';
          titleRef.current.style.opacity = '1';

          text.split('').forEach((char, i) => {
            setTimeout(() => {
              if (titleRef.current) {
                titleRef.current.textContent += char;
              }
            }, i * 60);
          });
        }

        // Description fade
        tl.fromTo(
          descRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
          0.8
        );

        // Posts clip reveal
        postsRef.current.forEach((post, i) => {
          if (post) {
            const image = post.querySelector('.post-image');
            const content = post.querySelector('.post-content');

            tl.fromTo(
              image,
              {
                clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)',
              },
              {
                clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
                duration: 1,
                ease: 'expo.out',
              },
              1 + i * 0.2
            );

            tl.fromTo(
              content,
              { y: 30, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
              `-=0.6`
            );
          }
        });

        // Button slide in
        tl.fromTo(
          buttonRef.current,
          { x: 50, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' },
          '-=0.3'
        );
      },
      once: true,
    });
    triggersRef.current.push(trigger);

    return () => {
      triggersRef.current.forEach((t) => t.kill());
      triggersRef.current = [];
    };
  }, [loading, posts]);

  if (!blogConfig.title || posts.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      id="blog"
      className="relative py-16 lg:py-32 px-8 lg:px-16 bg-black overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16">
          <div>
            <h2
              ref={titleRef}
              className="text-h4 sm:text-h3 md:text-h1 lg:text-display-xl text-white font-medium mb-4 opacity-0"
            >
              {blogConfig.title}
            </h2>
            <p
              ref={descRef}
              className="text-body-lg text-white/60 max-w-xl"
            >
              {blogConfig.subtitle}
            </p>
          </div>

          <button
            ref={buttonRef}
            className="hidden lg:flex items-center gap-2 text-body text-white/60 hover:text-white transition-colors duration-300 mt-8 lg:mt-0 group"
          >
            {blogConfig.allPostsLabel}
            <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
          </button>
        </div>

        {/* Blog posts grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {posts.map((post, index) => {
            const key = getPostKey(post);
            const isExpanded = expandedSlug === key;
            const hasBody = Boolean(post.body);

            return (
              <div
                key={post.id}
                ref={(el) => {
                  postsRef.current[index] = el;
                }}
                className="group cursor-pointer"
                onClick={() => hasBody && togglePost(post)}
              >
                {/* Image */}
                <div className="post-image relative aspect-[16/9] overflow-hidden mb-6">
                  <img
                    src={post.image || '/blog-1.jpg'}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Category tag */}
                  <div className="absolute top-4 left-4 px-4 py-2 bg-black/80 backdrop-blur-sm">
                    <span className="text-body-sm text-white">
                      {post.category}
                    </span>
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-highlight/0 group-hover:bg-highlight/10 transition-colors duration-300" />
                </div>

                {/* Content */}
                <div className="post-content">
                  {/* Meta */}
                  <div className="flex items-center gap-6 mb-4 text-body-sm text-white/50">
                    <span className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {blogConfig.readTimePrefix}{post.readTime}
                    </span>
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {post.date}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-h4 lg:text-h3 text-white font-medium mb-3 group-hover:text-highlight transition-colors duration-300 relative">
                    {post.title}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-highlight group-hover:w-full transition-all duration-300" />
                  </h3>

                  {/* Excerpt */}
                  <p className="text-body text-white/60 leading-relaxed">
                    {post.excerpt}
                  </p>

                  {/* Read more / Read less toggle */}
                  {hasBody && (
                    <div className="flex items-center gap-2 mt-4 text-body-sm text-white/40 group-hover:text-white transition-colors duration-300">
                      {isExpanded ? 'Read Less' : blogConfig.readMoreLabel}
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 transition-transform duration-300" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                      )}
                    </div>
                  )}
                </div>

                {/* Expanded body */}
                {isExpanded && post.body && (
                  <div
                    ref={(el) => { expandedRefs.current[key] = el; }}
                    className="overflow-hidden opacity-0"
                    style={{ height: 0 }}
                  >
                    <div className="pt-6 pb-8 border-t border-white/10 mt-6">
                      <div className="prose prose-invert max-w-none text-white/80 leading-relaxed">
                        {post.body.split(/\n\n+/).map((block, i) => {
                          if (block.startsWith('## ')) {
                            return (
                              <h4 key={i} className="text-h4 text-white font-medium mt-6 mb-3">
                                {block.replace('## ', '')}
                              </h4>
                            );
                          }
                          if (block.startsWith('### ')) {
                            return (
                              <h5 key={i} className="text-body-lg text-white font-medium mt-4 mb-2">
                                {block.replace('### ', '')}
                              </h5>
                            );
                          }
                          return (
                            <p key={i} className="text-body text-white/70 mb-4 leading-relaxed">
                              {block}
                            </p>
                          );
                        })}
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); togglePost(post); }}
                        className="mt-6 flex items-center gap-2 text-body-sm text-highlight hover:text-white transition-colors duration-300"
                      >
                        <ChevronUp className="w-4 h-4" />
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
