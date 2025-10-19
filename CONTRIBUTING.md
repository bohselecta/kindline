# Contributing to Kindline

Thank you for your interest in contributing to Kindline! This is a learning tool for relationship communication, and we welcome contributions that help improve the experience.

## 🎯 How to Contribute

### Bug Reports

If you find a bug, please create an issue with:

- **Clear description** of the problem
- **Steps to reproduce** the issue
- **Expected vs actual behavior**
- **Browser/device information** (if relevant)

### Feature Requests

We welcome feature ideas! Please create an issue with:

- **Clear description** of the feature
- **Use case** and why it would be helpful
- **Any mockups or examples** (if applicable)

### Code Contributions

1. **Fork the repository**
2. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** following our coding standards
4. **Test your changes** thoroughly
5. **Commit with clear messages**:
   ```bash
   git commit -m "Add: feature description"
   ```
6. **Push and create a Pull Request**

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+
- npm or pnpm
- Git

### Setup

```bash
# Clone your fork
git clone https://github.com/yourusername/kindline.git
cd kindline

# Install dependencies
npm install

# Copy environment file
cp env.example .env.local

# Start development server
npm run dev
```

### Code Standards

- **TypeScript**: Use strict typing
- **ESLint**: Follow the project's linting rules
- **Prettier**: Use consistent formatting
- **Components**: Use functional components with hooks
- **Styling**: Use Tailwind CSS classes
- **Testing**: Add tests for new features

### File Structure

- `app/` - Next.js App Router pages and API routes
- `lib/` - Core utilities, types, and constants
- `components/` - Reusable React components
- `public/` - Static assets

## 🧪 Testing

### Running Tests

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Build test
npm run build
```

### Testing Checklist

Before submitting a PR, ensure:

- [ ] TypeScript compiles without errors
- [ ] ESLint passes without warnings
- [ ] Build completes successfully
- [ ] Feature works in development
- [ ] No console errors in browser
- [ ] Responsive design works on mobile

## 📝 Pull Request Process

1. **Update documentation** if needed
2. **Add tests** for new functionality
3. **Update CHANGELOG.md** (if applicable)
4. **Ensure all checks pass**
5. **Request review** from maintainers

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested locally
- [ ] All tests pass
- [ ] No console errors

## Screenshots (if applicable)
Add screenshots to help explain your changes
```

## 🎨 Design Guidelines

### UI/UX Principles

- **Accessibility first** - Ensure keyboard navigation and screen reader support
- **Mobile responsive** - Design for mobile-first
- **Consistent styling** - Use Tailwind CSS consistently
- **Clear feedback** - Provide clear user feedback for all actions

### Audio Guidelines

- **Respect user choice** - Always allow users to control audio
- **Graceful fallbacks** - Handle autoplay restrictions gracefully
- **Clear indicators** - Show audio state clearly

## 🔒 Security

- **No sensitive data** in client-side code
- **Validate all inputs** on both client and server
- **Use environment variables** for API keys
- **Follow OWASP guidelines** for web security

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Hooks](https://reactjs.org/docs/hooks-intro.html)

## 🤝 Community Guidelines

- **Be respectful** and inclusive
- **Help others learn** and grow
- **Focus on the goal** of improving relationship communication
- **Keep discussions** constructive and on-topic

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🙏 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for helping make Kindline better! 💙
