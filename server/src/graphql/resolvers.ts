import { AuthenticationError } from 'apollo-server-express';
import User from '../models/User.js';
import { signToken } from '../services/auth.js';

interface AuthContext {
    user: {
        _id: string;
        username: string;
        email: string;
    } | null;
}
const resolvers = {
    Query: {
        me: async (_parent: unknown, _args: unknown, context: AuthContext) => {
            if (context.user) {
                return await User.findById(context.user._id);
            }
            throw new AuthenticationError('Not logged in');
        },
    },

    Mutation: {
        addUser: async (_parent: unknown,
            args: { username: string; email: string; password: string }) => {
            const user = await User.create(args);
            const token = signToken(user);
            return { token, user };
        },

        login: async (_parent: unknown, { email, password }) => {
            const user = await User.findOne({ email });
            if (!user || !(await user.isCorrectPassword(password))) {
                throw new AuthenticationError('Incorrect credentials');
            }
            const token = signToken(user);
            return { token, user };
        },

        saveBook: async (_parent, { bookData }, context) => {
            if (!context.user) throw new AuthenticationError('You must be logged in to save books');
            return await User.findByIdAndUpdate(
                context.user._id,
                { $addToSet: { savedBooks: bookData } },
                { new: true, runValidators: true }
            );
        },

        removeBook: async (_parent, { bookId }, context) => {
            if (!context.user) throw new AuthenticationError('You must be logged in to remove books');
            return await User.findByIdAndUpdate(
                context.user._id,
                { $pull: { savedBooks: { bookId } } },
                { new: true }
            );
        },
    },
};

export default resolvers;
