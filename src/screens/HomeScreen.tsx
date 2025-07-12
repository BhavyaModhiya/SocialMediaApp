import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, Image, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import notifee from '@notifee/react-native';

export default function HomeScreen() {
    const [posts, setPosts] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchPosts();
    }, [page]);

    const fetchPosts = async () => {
        if (loading) return;
        setLoading(true);
        try {
            const postRes = await fetch(`https://jsonplaceholder.typicode.com/posts?_limit=10&_page=${page}`);
            const postsData = await postRes.json();
            const userRes = await fetch(`https://jsonplaceholder.typicode.com/users`);
            const usersData = await userRes.json();

            const combined = postsData.map((post: any) => ({
                ...post,
                user: usersData.find((u: any) => u.id === post.userId),
                liked: false,
                likes: Math.floor(Math.random() * 100),
                showComments: false,
                comments: [],
                newComment: ''
            }));

            setPosts(prev => [...prev, ...combined]);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleLike = async (index: number) => {
        try {
            const updated = [...posts];
            updated[index].liked = !updated[index].liked;
            updated[index].likes += updated[index].liked ? 1 : -1;
            setPosts(updated);

            if (updated[index].liked) {
                await showLikeNotification(updated[index].user?.name || 'someone');
            }
        } catch (err) {
            console.error('Error toggling like:', err);
        }
    };

    async function showLikeNotification(userName: string) {
        try {
            await notifee.requestPermission();

            const channelId = await notifee.createChannel({
                id: 'important',
                name: 'likes',
            });

            await notifee.displayNotification({
                title: 'You liked a post!',
                body: `You liked ${userName}'s post.`,
                android: {
                    channelId,
                    smallIcon: 'ic_launcher',
                },
            });
        } catch (error) {
            console.error('Notification error:', error);
        }
    }


    return (
        <FlatList
            data={posts}
            keyExtractor={(item) => item.id.toString()}
            onEndReached={() => setPage(prev => prev + 1)}
            onEndReachedThreshold={0.5}
            ListFooterComponent={loading ? <ActivityIndicator /> : null}
            renderItem={({ item, index }) => (
                <View style={{ padding: 16, borderBottomWidth: 1, borderColor: '#ccc' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={{ uri: `https://i.pravatar.cc/150?img=${item.userId}` }} style={{ width: 40, height: 40, borderRadius: 20 }} />
                        <Text style={{ marginLeft: 10, fontWeight: 'bold' }}>{item.user?.name}</Text>
                    </View>
                    <Text style={{ marginVertical: 10 }}>{item.title}</Text>
                    <Image source={{ uri: `https://picsum.photos/seed/${item.id}/300/200` }} style={{ width: '100%', height: 200, borderRadius: 8 }} />
                    <TouchableOpacity onPress={() => toggleLike(index)} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                        <Icon name={item.liked ? 'heart' : 'heart-outline'} size={20} color={item.liked ? 'red' : 'black'} />
                        <Text style={{ marginLeft: 6 }}>{item.likes} Likes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        const updated = [...posts];
                        updated[index].showComments = !updated[index].showComments;
                        setPosts(updated);
                    }}>
                        <Text style={{ marginTop: 4, color: 'blue' }}>{item.showComments ? 'Hide Comments' : 'Comment'}</Text>
                    </TouchableOpacity>

                    {item.showComments && (
                        <View style={{ marginTop: 10 }}>
                            {item.comments.map((comment: any) => (
                                <Text key={comment.id} style={{ paddingVertical: 2, paddingLeft: 10 }}>💬 {comment.text}</Text>
                            ))}
                            <View style={{ flexDirection: 'row', marginTop: 6 }}>
                                <TextInput
                                    value={item.newComment}
                                    onChangeText={(text) => {
                                        const updated = [...posts];
                                        updated[index].newComment = text;
                                        setPosts(updated);
                                    }}
                                    placeholder="Write a comment..."
                                    style={{ flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 6, paddingHorizontal: 8 }}
                                />
                                <TouchableOpacity
                                    onPress={() => {
                                        if (!item.newComment.trim()) return;
                                        const updated = [...posts];
                                        updated[index].comments.push({
                                            id: Date.now(),
                                            text: item.newComment
                                        });
                                        updated[index].newComment = '';
                                        setPosts(updated);
                                    }}
                                    style={{
                                        marginLeft: 8,
                                        backgroundColor: '#007bff',
                                        borderRadius: 10,
                                        padding: 15,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Icon name="send" size={20} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </View>
            )}
        />
    );
}